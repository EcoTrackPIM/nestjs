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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadTripSchema = exports.RoadTrip = exports.VehicleType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var VehicleType;
(function (VehicleType) {
    VehicleType["DIESEL"] = "diesel";
    VehicleType["PETROL"] = "petrol";
    VehicleType["ELECTRIC"] = "battery_electric_vehicle";
})(VehicleType = exports.VehicleType || (exports.VehicleType = {}));
let RoadTrip = class RoadTrip {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], RoadTrip.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], RoadTrip.prototype, "startPoint", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], RoadTrip.prototype, "endPoint", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], RoadTrip.prototype, "distance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], RoadTrip.prototype, "co2Emissions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [[Number]], required: true }),
    __metadata("design:type", Array)
], RoadTrip.prototype, "routeCoordinates", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: VehicleType, required: true }),
    __metadata("design:type", String)
], RoadTrip.prototype, "vehicleType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], RoadTrip.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], RoadTrip.prototype, "averageSpeed", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], RoadTrip.prototype, "maxSpeed", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], RoadTrip.prototype, "duration", void 0);
RoadTrip = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], RoadTrip);
exports.RoadTrip = RoadTrip;
exports.RoadTripSchema = mongoose_1.SchemaFactory.createForClass(RoadTrip);
//# sourceMappingURL=road.entity.js.map