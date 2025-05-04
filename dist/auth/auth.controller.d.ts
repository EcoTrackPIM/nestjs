/// <reference types="multer" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { registerdto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgetDto, ResetDto } from './dto/forget.dto';
import { TwilioService } from 'nestjs-twilio';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    private readonly mailService;
    private readonly smsService;
    constructor(authService: AuthService, mailService: MailerService, smsService: TwilioService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    getProfile(req: any): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    uploadProfileImage(file: Express.Multer.File, req: any): Promise<{
        message: string;
        user: User;
    }>;
    sms(): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance>;
    register(data: registerdto): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    forget(data: ForgetDto): Promise<{
        message: string;
        resetcode: any;
    }>;
    resetPassword(dto: ResetDto): Promise<{
        message: string;
    }>;
    googleLogin(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    loginFacebook(accessToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        error?: undefined;
    } | {
        accessToken: string;
        refreshToken: string;
        newuser: import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        error?: undefined;
    } | {
        error: any;
    }>;
    sendTestEmail(): Promise<{
        mail: any;
        error?: undefined;
    } | {
        error: any;
        mail?: undefined;
    }>;
    findAll(page: number): Promise<User[]>;
    findOne(id: string): Promise<string>;
    updateProfile(req: any, data: UpdateAuthDto): Promise<User>;
    remove(id: string): Promise<string>;
}
