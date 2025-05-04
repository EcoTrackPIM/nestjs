import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { TwilioModule } from 'nestjs-twilio';
import { MediaModule } from './media/media.module';
import { JwtModule } from '@nestjs/jwt';
import { OcrController } from './ocr/ocr.controller';
import { OcrService } from './ocr/ocr.service';
import { WeatherController } from './meteo/weather.controller';
import { UploadController } from './upload/upload.controller';
import { WeatherService } from './meteo/weather.service';
import { UploadService } from './upload/upload.service'; // <--- This import is likely redundant
import { GroqModule } from './groq.module';
import { EventModule } from './event/event.module';
import { AiModule } from './AI/ai.module';
import { ChatModule } from './chat/chat.module';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';
import { ScanResultModule } from './scan-result/scan-result.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost/pim'),
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 587,
        auth: {
          user: 'a147c4ee293502',
          pass: '58f901639df100',
        },
      },
    }),
    MediaModule,
    {
      ...JwtModule.register({
        secret: 'hesfgdhfh',
        signOptions: { expiresIn: '10h' },
      }),
      global: true,
    },
    {
      ...TwilioModule.forRoot({
        accountSid: 'ACb910d21f1d160b978216e4a092bfa0eb',
        authToken: 'dad55962d6ba6a9fe2807b5c8030ca82',
      }),
      global: true,
    },
    UploadModule, // <--- You are importing UploadModule here
    ChatModule,
    GroqModule,
    EventModule,
    AiModule,
    ProductModule,
    ScanResultModule,
    ItemModule
  ],
  controllers: [AppController, OcrController, WeatherController, UploadController],
  providers: [AppService, OcrService, WeatherService, UploadService], // <--- You are also providing UploadService here
})
export class AppModule {}