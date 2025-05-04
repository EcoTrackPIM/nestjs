"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const chat_entity_1 = require("./entities/chat.entity");
const mongoose_2 = require("mongoose");
const groq_service_1 = require("../groq.service");
const fs = require("fs");
const path_1 = require("path");
let ChatService = class ChatService {
    constructor(chatmsgschema, groqService) {
        this.chatmsgschema = chatmsgschema;
        this.groqService = groqService;
    }
    async create(createChatDto, userid) {
        const { text, type } = createChatDto;
        if (type == "text") {
            const chatmsg = await this.chatmsgschema.create({
                ...createChatDto,
                userId: userid,
                author: {
                    id: "hello",
                }
            });
            return chatmsg;
        }
        if (type == "audio") {
            const chatmsg = await this.chatmsgschema.create({
                ...createChatDto,
                userId: userid,
                author: {
                    id: "hello",
                }
            });
            await this.transcribeAudio(chatmsg.uri);
            return chatmsg;
        }
    }
    async findAll(userid) {
        const chatmsg = await this.chatmsgschema
            .find({ userId: userid })
            .select('-__v -_id -userId')
            .sort({ createdAt: 1 })
            .exec();
        return chatmsg;
    }
    findOne(id) {
        return `This action returns a #${id} chat`;
    }
    update(id, updateChatDto) {
        return `This action updates a #${id} chat`;
    }
    remove(id) {
        return `This action removes a #${id} chat`;
    }
    async transcribeAudio(filename) {
        try {
            const filePath = (0, path_1.join)(__dirname, '..', '..', 'uploads', filename);
            console.log(filePath);
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
        }
        catch (error) {
            console.error('Error transcribing audio:', error);
            throw error;
        }
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_entity_1.Chatmsg.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        groq_service_1.GroqService])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map