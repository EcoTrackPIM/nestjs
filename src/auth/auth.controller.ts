import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards,UnauthorizedException, Req, Headers, Res, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Logindto, updateUser } from './dto/login.dto';
import { registerdto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Protect } from './auth.guard';
import { Request } from 'express';
import { ForgetDto, ResetDto } from './dto/forget.dto';
import { TwilioService } from 'nestjs-twilio';
import { HttpCode } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailerService,
    private readonly smsService: TwilioService
  ) {}

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(Protect)
  @Get('/profile')
  async getProfile(@Req() req) {
    const user = await this.authService.findUserById(req.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  @Post('upload-profile-image')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/profile-images',
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  @UseGuards(Protect)
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
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

  @Get('/sms')
  sms() {
    return this.smsService.client.messages.create({
      body: 'SMS Body, sent to the phone!',
      from: '+13612881226',
      to: '+216 20105789',
    });
  }

  @Post('/register')
  async register(@Body() data: registerdto) {
    return this.authService.register(data);
  }

  @Post('/forget-password')
  async forget(@Body() data: ForgetDto) {
    return this.authService.forget(data);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetDto) {
    return this.authService.reset(dto);
  }

  @Post('google-login')
  async googleLogin(@Body('token') token: string) {
    return this.authService.googleLogin(token);
  }

  @Post('/facebook')
  async loginFacebook(@Body('accessToken') accessToken: string) {
    return this.authService.handleFacebookLogin(accessToken);
  }

  @Get('send')
  async sendTestEmail() {
    try {
      const mail = await this.mailService.sendMail({
        from: 'Kingsley Okure <kingsleyokgeorge@gmail.com>',
        to: "mradmohamed700@gmail.com",
        subject: 'How to Send Emails with Nodemailer',
        text: 'Welcome',
      });
      return { mail };
    } catch (error) {
      console.log(error);
      return { error };
    }
  }

  @Get('/users')
  async findAll(@Query('page') page: number) {
    return this.authService.findAll(+page);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @UseGuards(Protect)
  @Put('/update')
  async updateProfile(
    @Req() req,
    @Body() data: UpdateAuthDto
  ): Promise<User> {
    return this.authService.update(req.userId, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
