import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoadTrip, RoadTripSchema } from './entities/road.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RoadTrip.name, schema: RoadTripSchema }]),
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
