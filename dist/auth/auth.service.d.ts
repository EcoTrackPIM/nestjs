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
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { Logindto } from './dto/login.dto';
import { registerdto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { RefreshToken } from './entities/refreshtoken.entity';
import { TwilioService } from 'nestjs-twilio';
import { ForgetDto, ResetDto } from './dto/forget.dto';
import { resetCode } from './entities/resetCode.entity';
export declare class AuthService {
    private usermodel;
    private refreshTokenModel;
    private resetcodemodel;
    private readonly jwtservice;
    private readonly mailService;
    private readonly smsService;
    constructor(usermodel: Model<User>, refreshTokenModel: Model<RefreshToken>, resetcodemodel: Model<resetCode>, jwtservice: JwtService, mailService: MailerService, smsService: TwilioService);
    login(data: Logindto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    register(data: registerdto): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(page: number): Promise<User[]>;
    findOne(id: number): string;
    update(id: string, data: UpdateAuthDto): Promise<User>;
    remove(id: number): string;
    ver(token: string): Promise<any>;
    getProfile(userId: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    generateUserTokens(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    storeRefreshToken(token: string, userId: string): Promise<void>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    forget(data: ForgetDto): Promise<{
        message: string;
        resetcode: any;
    }>;
    reset(data: ResetDto): Promise<{
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
    findUserById(userId: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    handleFacebookLogin(accessToken: string): Promise<{
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
}
