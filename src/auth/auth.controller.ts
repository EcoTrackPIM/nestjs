import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards, Req, Headers, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Logindto, updateUser } from './dto/login.dto';
import { registerdto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Protect } from './auth.guard';
import { Request } from 'express';
import { ForgetDto, ResetDto } from './dto/forget.dto';
import { TwilioService } from 'nestjs-twilio';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly mailService: MailerService,
    private readonly smsService: TwilioService
  ) {}

  @Post('/login')
  create(@Body() data: Logindto) {
    return this.authService.login(data);
  }





  

  @Get('/sms')
  sms(){
    return this.smsService.client.messages.create({
      body: 'SMS Body, sent to the phone!',
      from:  '+13612881226',
      to: '+216 20105789',
    });
  }

  @Post('/register')
  register(@Body() data: registerdto) {
    return this.authService.register(data);
  }

  @Post('/forget-password')
  forget(@Body() data: ForgetDto){
    return this.authService.forget(data)
  }


  @Post('/reset-password')
  reset(@Body() data: ResetDto){
    return this.authService.reset(data)
  }





  @Post('/facebook')
  loginfacebook(@Body('accessToken') accessToken: string){
    return this.authService.handleFacebookLogin(accessToken)
    //return{accessToken}
  }




  @Get('send')
  async send(){
    try {
      const mail = await this.mailService.sendMail({
        from: 'Kingsley Okure <kingsleyokgeorge@gmail.com>',
        to: "mradmohamed700@gmail.com",
        subject: `How to Send Emails with Nodemailer`,
        text: `welcome `,
      });
      return {mail}
    } catch (error) {
      console.log(error)
      return {error}
    }
  }

  //@UseGuards(Protect)
  @Get('/users')
  findAll(@Req() req, @Query('page') page: number, @Headers() headers) {
    // const authHeader = headers['authorization'] // manually get the Authorization header value
    // const token = authHeader.split(' ')[1]
    // return this.authService.ver(token)
    return this.authService.findAll(+page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  
  @UseGuards(Protect)
  @Put('/update')
  update( @Req() req, @Body() data: UpdateAuthDto): Promise<User> {
    return this.authService.update(req.userId, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
