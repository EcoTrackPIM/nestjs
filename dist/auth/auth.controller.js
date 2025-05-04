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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const update_auth_dto_1 = require("./dto/update-auth.dto");
const register_dto_1 = require("./dto/register.dto");
const mailer_1 = require("@nestjs-modules/mailer");
const auth_guard_1 = require("./auth.guard");
const forget_dto_1 = require("./dto/forget.dto");
const nestjs_twilio_1 = require("nestjs-twilio");
const common_2 = require("@nestjs/common");
const login_dto_1 = require("./dto/login.dto");
let AuthController = class AuthController {
    constructor(authService, mailService, smsService) {
        this.authService = authService;
        this.mailService = mailService;
        this.smsService = smsService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async getProfile(req) {
        const user = await this.authService.findUserById(req.userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async uploadProfileImage(file, req) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const imageUrl = `/profile-images/${file.filename}`;
        const updatedUser = await this.authService.update(req.userId, {
            profileImage: imageUrl
        });
        return {
            message: 'Profile image uploaded successfully',
            user: updatedUser,
        };
    }
    sms() {
        return this.smsService.client.messages.create({
            body: 'SMS Body, sent to the phone!',
            from: '+13612881226',
            to: '+216 20105789',
        });
    }
    async register(data) {
        return this.authService.register(data);
    }
    async forget(data) {
        return this.authService.forget(data);
    }
    async resetPassword(dto) {
        return this.authService.reset(dto);
    }
    async googleLogin(token) {
        return this.authService.googleLogin(token);
    }
    async loginFacebook(accessToken) {
        return this.authService.handleFacebookLogin(accessToken);
    }
    async sendTestEmail() {
        try {
            const mail = await this.mailService.sendMail({
                from: 'Kingsley Okure <kingsleyokgeorge@gmail.com>',
                to: "mradmohamed700@gmail.com",
                subject: 'How to Send Emails with Nodemailer',
                text: 'Welcome',
            });
            return { mail };
        }
        catch (error) {
            console.log(error);
            return { error };
        }
    }
    async findAll(page) {
        return this.authService.findAll(+page);
    }
    async findOne(id) {
        return this.authService.findOne(+id);
    }
    async updateProfile(req, data) {
        return this.authService.update(req.userId, data);
    }
    async remove(id) {
        return this.authService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)('/login'),
    (0, common_2.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.Protect),
    (0, common_1.Get)('/profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('upload-profile-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/profile-images',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                return cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    })),
    (0, common_1.UseGuards)(auth_guard_1.Protect),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "uploadProfileImage", null);
__decorate([
    (0, common_1.Get)('/sms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sms", null);
__decorate([
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.registerdto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('/forget-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forget_dto_1.ForgetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forget", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forget_dto_1.ResetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('google-login'),
    __param(0, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Post)('/facebook'),
    __param(0, (0, common_1.Body)('accessToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginFacebook", null);
__decorate([
    (0, common_1.Get)('send'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendTestEmail", null);
__decorate([
    (0, common_1.Get)('/users'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.Protect),
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_auth_dto_1.UpdateAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "remove", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        mailer_1.MailerService,
        nestjs_twilio_1.TwilioService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map