import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userShcema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RefreshToken, RefreshTokenSchema } from './entities/refreshtoken.entity';
import { TwilioModule, TwilioService } from 'nestjs-twilio';
import { resetCode, resetcodeschema } from './entities/resetCode.entity';

@Module({
  imports: [MongooseModule.forFeature(
    [
    {
    name: User.name,
    schema: userShcema
    },
    {
    name: RefreshToken.name,
    schema: RefreshTokenSchema
    },
    {
      name: resetCode.name,
      schema: resetcodeschema
    }
  ]
),



],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
