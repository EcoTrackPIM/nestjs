import mongoose from "mongoose";
export declare enum VehicleType {
    DIESEL = "diesel",
    PETROL = "petrol",
    ELECTRIC = "battery_electric_vehicle"
}
export declare class RoadTrip {
    userId: string;
    startPoint: {
        lat: number;
        lng: number;
    };
    endPoint: {
        lat: number;
        lng: number;
    };
    distance: number;
    co2Emissions: number;
    routeCoordinates: number[][];
    vehicleType: VehicleType;
    date: Date;
    averageSpeed: number;
    maxSpeed: number;
    duration: number;
}
export declare const RoadTripSchema: mongoose.Schema<RoadTrip, mongoose.Model<RoadTrip, any, any, any, mongoose.Document<unknown, any, RoadTrip> & RoadTrip & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, RoadTrip, mongoose.Document<unknown, {}, mongoose.FlatRecord<RoadTrip>> & mongoose.FlatRecord<RoadTrip> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
