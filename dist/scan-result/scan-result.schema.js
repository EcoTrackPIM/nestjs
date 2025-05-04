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
exports.ScanResultSchema = exports.ScanResult = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let ScanResult = class ScanResult {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: "No text extracted" }),
    __metadata("design:type", String)
], ScanResult.prototype, "extractedText", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true, default: {} }),
    __metadata("design:type", Object)
], ScanResult.prototype, "detectedComposition", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], ScanResult.prototype, "isExact", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], ScanResult.prototype, "processingTimeMs", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ScanResult.prototype, "imagePath", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ScanResult.prototype, "userId", void 0);
ScanResult = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    })
], ScanResult);
exports.ScanResult = ScanResult;
exports.ScanResultSchema = mongoose_1.SchemaFactory.createForClass(ScanResult);
//# sourceMappingURL=scan-result.schema.js.map