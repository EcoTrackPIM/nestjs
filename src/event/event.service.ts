import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './entities/event.entity';
import { Model } from 'mongoose';
import { GroqService } from 'src/groq.service';

@Injectable()
export class EventService {
  constructor(
        @InjectModel(Event.name) private eventschema: Model<Event>,
        private groqService: GroqService,
      ){}
  async create(createEventDto: CreateEventDto): Promise<Event> {
    return await this.eventschema.create(createEventDto)
  }

  findAll() {
    return `This action returns all event`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
