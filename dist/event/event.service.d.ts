import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { Model } from 'mongoose';
import { GroqService } from 'src/groq.service';
export declare class EventService {
    private eventschema;
    private groqService;
    constructor(eventschema: Model<Event>, groqService: GroqService);
    create(createEventDto: CreateEventDto): Promise<Event>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateEventDto: UpdateEventDto): string;
    remove(id: number): string;
}
