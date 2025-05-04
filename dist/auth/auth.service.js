"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_entity_1 = require("./entities/user.entity");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
const refreshtoken_entity_1 = require("./entities/refreshtoken.entity");
const uuid_1 = require("uuid");
const nestjs_twilio_1 = require("nestjs-twilio");
const randomstring = require("randomstring");
const resetCode_entity_1 = require("./entities/resetCode.entity");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const google_auth_library_1 = require("google-auth-library");
let AuthService = class AuthService {
    constructor(usermodel, refreshTokenModel, resetcodemodel, jwtservice, mailService, smsService) {
        this.usermodel = usermodel;
        this.refreshTokenModel = refreshTokenModel;
        this.resetcodemodel = resetcodemodel;
        this.jwtservice = jwtservice;
        this.mailService = mailService;
        this.smsService = smsService;
    }
    async login(data) {
        const { email, password } = data;
        const user = await this.usermodel.findOne({ email }).populate('Profile_pic');
        if (!user) {
            throw new common_1.BadRequestException('wrong email');
        }
        const pass = await bcrypt.compare(password, user.password);
        if (!pass) {
            throw new common_1.BadRequestException('wrong password');
        }
        const tokens = await this.generateUserTokens(user._id.toString());
        return {
            user,
            ...tokens
        };
    }
    async register(data) {
        const { name, email, roles, password } = data;
        const user = await this.usermodel.findOne({ email });
        if (user) {
            throw new common_1.BadRequestException('user email aready in use');
        }
        const hashpassword = await bcrypt.hash(password, 10);
        return await this.usermodel.create({
            ...data,
            password: hashpassword,
        });
    }
    async findAll(page) {
        const limit = 2;
        const skip = (page - 1) * limit;
        return await this.usermodel.find()
            .populate("Profile_pic");
    }
    findOne(id) {
        return `This action returns a #${id} auth`;
    }
    async update(id, data) {
        return await this.usermodel.findByIdAndUpdate(id, data, { new: true }).populate('Profile_pic');
    }
    remove(id) {
        return `This action removes a #${id} auth`;
    }
    async ver(token) {
        return await this.jwtservice.verify(token);
    }
    async getProfile(userId) {
        const user = await this.usermodel.findById(userId).populate('Profile_pic');
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        return user;
    }
    async generateUserTokens(userId) {
        const accessToken = this.jwtservice.sign({ userId }, { expiresIn: '10h' });
        const refreshToken = (0, uuid_1.v4)();
        await this.storeRefreshToken(refreshToken, userId);
        return {
            accessToken,
            refreshToken,
        };
    }
    async storeRefreshToken(token, userId) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 3);
        await this.refreshTokenModel.updateOne({ userId }, { $set: { expiryDate, token } }, { upsert: true });
    }
    async refreshTokens(refreshToken) {
        const token = await this.refreshTokenModel.findOne({
            token: refreshToken,
            expiryDate: { $gte: new Date() },
        });
        if (!token) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        return this.generateUserTokens(token.userId);
    }
    async forget(data) {
        const { email } = data;
        const user = await this.usermodel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException("Email not found");
        }
        const resetcode = randomstring.generate({
            length: 4,
            charset: 'numeric'
        });
        try {
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            await this.resetcodemodel.create({
                email: user.email,
                code: resetcode,
                expiryDate: expiryDate
            });
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            const emailHtml = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Password</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                }
                .email-container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border: 1px solid #e0e0e0;
                  border-radius: 8px;
                }
                .header {
                  text-align: center;
                  color: white;
                  padding: 25px 0;
                  background: #7F51CA;
                }
                .content {
                  padding: 20px;
                  color: #333333;
                }
                .content p {
                  line-height: 1.6;
                  margin: 10px 0;
                }
                .content .reset-code {
                  font-size: 28px;
                  width: fit-content;
                  margin: auto;
                  font-weight: bold;
                  color: #7F51CA;
                }
                .footer {
                  text-align: center;
                  padding: 10px;
                  font-size: 12px;
                  color: #777777;
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="header">
                  <h2>Reset Your Password</h2>
                </div>
                <div class="content">
                  <p>Hello ${user.name},</p>
                  <p>We received a request to reset your password. Use the code below to reset your password:</p>
                  <p class="reset-code">${resetcode}</p>
                  <p>If you didn’t request this, please ignore this email. Your password won’t be changed.</p>
                </div>
                <div class="footer">
                  <p>Thank you,<br>Support Team</p>
                  <p>&copy; ${new Date().getFullYear()} NUTRIFIT. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `;
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Reset Password',
                html: emailHtml
            });
            return { message: "Mail sent successfully", resetcode };
        }
        catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send reset password email");
        }
    }
    async reset(data) {
        const { email, code, newPassword } = data;
        const resetcode = await this.resetcodemodel.findOneAndDelete({
            email,
            code,
            expiryDate: { $gte: new Date() }
        });
        if (!resetcode) {
            throw new common_1.UnauthorizedException("Invalid Verification");
        }
        const user = await this.usermodel.findOne({ email: resetcode.email });
        const newhashedpass = await bcrypt.hash(newPassword, 10);
        user.password = newhashedpass;
        user.save();
        return { message: "password reset successfully" };
    }
    async googleLogin(token) {
        const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new common_1.UnauthorizedException('Invalid Google token');
        }
        const { email, name, picture } = payload;
        let user = await this.usermodel.findOne({ email });
        if (!user) {
            user = await this.usermodel.create({
                name,
                email,
                password: await bcrypt.hash('defaultpassword', 10),
                profilePic: picture,
            });
        }
        const tokens = await this.generateUserTokens(user._id.toString());
        return { user, ...tokens };
    }
    async findUserById(userId) {
        return this.usermodel.findById(userId);
    }
    async handleFacebookLogin(accessToken) {
        const facebookApiUrl = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`;
        try {
            const response = await fetch(facebookApiUrl);
            const fbUserData = await response.json();
            console.log(fbUserData);
            const user = await this.usermodel.findOne({ email: fbUserData.email });
            if (user) {
                const tokens = await this.generateUserTokens(user._id.toString());
                return {
                    user,
                    ...tokens
                };
            }
            else {
                const hashpassword = await bcrypt.hash("test", 10);
                const newuser = await this.usermodel.create({
                    name: fbUserData.name,
                    email: fbUserData.email,
                    password: hashpassword
                });
                const tokens = await this.generateUserTokens(newuser._id.toString());
                return {
                    newuser,
                    ...tokens
                };
            }
        }
        catch (error) {
            return { error };
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(refreshtoken_entity_1.RefreshToken.name)),
    __param(2, (0, mongoose_1.InjectModel)(resetCode_entity_1.resetCode.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        mailer_1.MailerService,
        nestjs_twilio_1.TwilioService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map