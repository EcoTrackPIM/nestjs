import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatmsg, chatmsgShcema } from './entities/chat.entity';

@Module({
  imports: [
    // Add any necessary imports here, such as MongooseModule.forFeature if using MongoDB
     MongooseModule.forFeature([{ name: Chatmsg.name, schema: chatmsgShcema }]),
    // Other modules can be imported here as needed
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
