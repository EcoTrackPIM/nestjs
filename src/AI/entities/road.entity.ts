import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export enum VehicleType {
  DIESEL = 'diesel',
  PETROL = 'petrol',
  ELECTRIC = 'battery_electric_vehicle',
}

// export enum TripStatus {
//   COMPLETED = 'completed',
//   IN_PROGRESS = 'in_progress',
//   CANCELLED = 'cancelled',
// }

@Schema({ timestamps: true })
export class RoadTrip {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({type: Object , required: true })
  startPoint: {
    lat: number;
    lng: number;
  };

  @Prop({type: Object, required: true })
  endPoint: {
    lat: number;
    lng: number;
  };

  @Prop({ required: true })
  distance: number; // in meters

  @Prop({ required: true })
  co2Emissions: number; // in kg

  @Prop({ type: [[Number]], required: true }) // Array of [lat, lng] pairs
  routeCoordinates: number[][];

  @Prop({ enum: VehicleType, required: true })
  vehicleType: VehicleType;

//   @Prop({ enum: TripStatus, default: TripStatus.COMPLETED })
//   status: TripStatus;

//   @Prop()
//   startedAt: Date;

  @Prop()
  date: Date;

  @Prop()
  averageSpeed: number; // in km/h

  @Prop()
  maxSpeed: number; // in km/h

  @Prop()
  duration: number; // in seconds
}

export const RoadTripSchema = SchemaFactory.createForClass(RoadTrip);