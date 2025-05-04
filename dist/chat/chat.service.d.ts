import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chatmsg } from './entities/chat.entity';
import { Model } from 'mongoose';
import { GroqService } from 'src/groq.service';
export declare class ChatService {
    private chatmsgschema;
    private groqService;
    constructor(chatmsgschema: Model<Chatmsg>, groqService: GroqService);
    create(createChatDto: CreateChatDto, userid: String): Promise<Chatmsg>;
    findAll(userid: String): Promise<Chatmsg[]>;
    findOne(id: number): string;
    update(id: number, updateChatDto: UpdateChatDto): string;
    remove(id: number): string;
    transcribeAudio(filename: string): Promise<string>;
}
