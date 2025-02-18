import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, mediaShcema } from './entities/media.entity';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Media.name,
    schema: mediaShcema
  }])],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
