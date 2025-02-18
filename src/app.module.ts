import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { TwilioModule, TwilioService } from 'nestjs-twilio';
import { MediaModule } from './media/media.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, MongooseModule.forRoot('mongodb://localhost/pim'),
    MailerModule.forRoot({
      transport: {
        host: "sandbox.smtp.mailtrap.io",
        port: 587,
        auth: {
          user: "a147c4ee293502",
          pass: "58f901639df100"
        }
      }      
    }),
    MediaModule,
    {
      ...JwtModule.register({
        secret:  'hesfgdhfh', // Vous pouvez aussi mettre une clé par défaut
        signOptions: { expiresIn: '10h' },
      }),
      global: true
    },
    {
      ...TwilioModule.forRoot({
        accountSid: 'ACb910d21f1d160b978216e4a092bfa0eb',
        authToken: 'dad55962d6ba6a9fe2807b5c8030ca82',
      }),
      global: true
    },
    
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
