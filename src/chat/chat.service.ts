import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chatmsg } from './entities/chat.entity';
import { Model } from 'mongoose';
import { GroqService } from 'src/groq.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ChatService {
    constructor(
      @InjectModel(Chatmsg.name) private chatmsgschema: Model<Chatmsg>,
      private groqService: GroqService,
    ){}

  async create(createChatDto: CreateChatDto, userid: String): Promise<Chatmsg> {
    const {  text, type } = createChatDto;
    if(type == "text"){
      const chatmsg = await this.chatmsgschema.create({
        ...createChatDto,
        userId: userid,
        author: {
          id: "hello",
        }
      });
      return chatmsg;
  }

  if(type == "audio"){
    const chatmsg = await this.chatmsgschema.create({
      ...createChatDto,
      userId: userid,
      author: {
        id: "hello",
      }
    });

    await this.transcribeAudio(chatmsg.uri)
    return chatmsg;
}
}

  async findAll(userid: String): Promise<Chatmsg[]> {
    const chatmsg = await this.chatmsgschema
    .find({ userId: userid })
    .select('-__v -_id -userId')
    .sort({ createdAt: 1 }) // ascending: oldest first, latest last
    .exec();
    return chatmsg;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  async transcribeAudio(filename: string): Promise<string> {
    try {
      const filePath = join(__dirname, '..', '..', 'uploads', filename); // adjust relative path if needed
      console.log(filePath)

      const transcription = await this.groqService.getClient().audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: 'whisper-large-v3-turbo',
        prompt: 'Context: This audio may contain English, French, and Tunisian Arabic. Ensure accurate spelling and grammar. if its arabic write in arabic',
        response_format: 'verbose_json',
        timestamp_granularities: ['word', 'segment'],
        temperature: 0.0,
      });

      console.log('Transcription:', transcription.text);
      return transcription.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }
}
