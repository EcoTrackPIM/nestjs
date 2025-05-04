import { BadRequestException, Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { Logindto } from './dto/login.dto';
import { registerdto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { RefreshToken } from './entities/refreshtoken.entity';
import { v4 as uuidv4 } from 'uuid'; // Pour générer des jetons d'actualisation uniques
import { TwilioService } from 'nestjs-twilio';
import { ForgetDto, ResetDto } from './dto/forget.dto';
import * as randomstring from 'randomstring'
import { resetCode } from './entities/resetCode.entity';
import { Response } from 'express';
import axios from 'axios';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();
import { OAuth2Client } from 'google-auth-library';




@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private usermodel: Model<User>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
    @InjectModel(resetCode.name) private resetcodemodel: Model<resetCode>,
    private readonly jwtservice: JwtService,
    private readonly mailService: MailerService,
    private readonly smsService: TwilioService,
  ){}
  async login(data: Logindto) {
    const {email, password} = data;
  
    const user = await this.usermodel.findOne({email}).populate('Profile_pic');
  
    if(!user){
      throw new BadRequestException('wrong email');
    }
  
    const pass = await bcrypt.compare(password, user.password);
    if(!pass){
      throw new BadRequestException('wrong password');
    }
  
    const tokens = await this.generateUserTokens(user._id.toString());
    return {
      user,
      ...tokens
    };
  }


  async register(data:registerdto) {
    const {name, email, roles, password} = data

    const user = await this.usermodel.findOne({email})
    if(user){
      throw new BadRequestException('user email aready in use')
    }
    const hashpassword = await bcrypt.hash(password, 10)



  //  await this.smsService.client.messages.create({
  //     body: 'A new User has been registered to your app',
  //     from:  '+13612881226',
  //     to: '+216 27191738',
  //   });

    return await this.usermodel.create({
      ...data,
      password: hashpassword,
      

    })

    // try {
    //   const mail = await this.mailService.sendMail({
    //     from: 'Kingsley Okure <kingsleyokgeorge@gmail.com>',
    //     to: newuser.email,
    //     subject: `How to Send Emails with Nodemailer`,
    //     text: `welcome ${newuser.name}`,
    //   });
    //   return {mail}
    // } catch (error) {
    //   console.log(error)
    //   return {error}
    // }
  }

  async findAll(page: number): Promise<User[]> {
    const limit = 2; // Number of items per page
    const skip = (page - 1) * limit; // Calculate the number of items to skip
    
    return await this.usermodel.find()
    .populate("Profile_pic");
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async update(id: string, data: UpdateAuthDto): Promise<User> {
    return await this.usermodel.findByIdAndUpdate(id, data, {new: true}).populate('Profile_pic')
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async ver(token: string){
    return await this.jwtservice.verify(token)
  }

  async getProfile(userId: string) {
    const user = await this.usermodel.findById(userId).populate('Profile_pic');
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }






  async generateUserTokens(userId: string) {
    const accessToken = this.jwtservice.sign({ userId }, { expiresIn: '10h' });
    const refreshToken = uuidv4(); // Génération d'un UUID pour le token d'actualisation

    await this.storeRefreshToken(refreshToken, userId);

    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3); // Le token d'actualisation expire dans 3 jours

    await this.refreshTokenModel.updateOne(
      { userId },
      { $set: { expiryDate, token } },
      { upsert: true }, // Créer le document s'il n'existe pas
    );
  }

  async refreshTokens(refreshToken: string) {
    // Vérifier si le token d'actualisation est valide et non expiré
    const token = await this.refreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Générer un nouvel ensemble de tokens
    return this.generateUserTokens(token.userId);
  }


async forget(data: ForgetDto) {
    const { email } = data;
    const user = await this.usermodel.findOne({ email });

    if (!user) {
        throw new UnauthorizedException("Email not found");
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

        // Configure Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Use environment variables
                pass: process.env.EMAIL_PASS
            }
        });

        // Email HTML Template
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

        // Send Email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Reset Password',
            html: emailHtml
        });

        return { message: "Mail sent successfully", resetcode };
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send reset password email");
    }
}






  async reset(data: ResetDto){
    const {email, code, newPassword} = data
    const resetcode = await this.resetcodemodel.findOneAndDelete(
      {
      email,
      code,
      expiryDate: {$gte: new Date()}
      }
    )
    if(!resetcode){
      throw new UnauthorizedException("Invalid Verification")
    }
    const user = await this.usermodel.findOne({email: resetcode.email})
    const newhashedpass = await bcrypt.hash(newPassword, 10)
    user.password = newhashedpass
    user.save()
    return {message: "password reset successfully"}
  }



  async googleLogin(token: string) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  
    const payload = ticket.getPayload();
    if (!payload) {
      throw new UnauthorizedException('Invalid Google token');
    }
  
    const { email, name, picture } = payload;
  
    let user = await this.usermodel.findOne({ email });
  
    if (!user) {
      user = await this.usermodel.create({
        name,
        email,
        password: await bcrypt.hash('defaultpassword', 10), // Dummy password
        profilePic: picture,
      });
    }
  
    const tokens = await this.generateUserTokens(user._id.toString());
  
    return { user, ...tokens };
  }

  async findUserById(userId: string) {
    return this.usermodel.findById(userId);
  }





  async handleFacebookLogin(accessToken: string) {
    // Verify token and get user data from Facebook
    const facebookApiUrl = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`;
    try {
      const response = await fetch(facebookApiUrl);
      const fbUserData = await response.json();
      console.log(fbUserData)
      const user = await this.usermodel.findOne({email: fbUserData.email})
      if(user){
        //throw new BadRequestException("User not found")
        // const token = await this.jwtservice.sign({userId: user._id}, {expiresIn: '10h'})
    const tokens = await this.generateUserTokens(user._id.toString());
    return {
      user,
      ...tokens
    }
      }
      else{
        const hashpassword = await bcrypt.hash("test", 10)

        const newuser = await this.usermodel.create({
          name: fbUserData.name,
          email: fbUserData.email,
          password: hashpassword
        })

        // const token = await this.jwtservice.sign({userId: user._id}, {expiresIn: '10h'})
    const tokens = await this.generateUserTokens(newuser._id.toString());
    return {
      newuser,
      ...tokens
    }
      }
    } catch (error) {
      return {error}
    }


    // Check if the user exists in MongoDB
    // let user = await this.usermodel.findOne({ email: fbUserData.email });
    
    // // Register the user if they don't exist
    // if (!user) {
    //     user = new this.usermodel({
    //         //facebookId: fbUserData.id,
    //         name: fbUserData.name,
    //         email: fbUserData.email,
    //         //profilePicture: fbUserData.picture?.data?.url
    //     });
    //     await user.save();
    //     return user;
    // }
    // return {message: "no user"}
    
    // You can return the user data or create a JWT token for authenticated sessions
}
}
