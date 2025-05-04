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
exports.chatmsgShcema = exports.Chatmsg = exports.Status = exports.MessageType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var MessageType;
(function (MessageType) {
    MessageType["AUDIO"] = "audio";
    MessageType["CUSTOM"] = "custom";
    MessageType["FILE"] = "file";
    MessageType["IMAGE"] = "image";
    MessageType["SYSTEM"] = "system";
    MessageType["TEXT"] = "text";
    MessageType["UNSUPPORTED"] = "unsupported";
    MessageType["VIDEO"] = "video";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var Status;
(function (Status) {
    Status["DELIVERED"] = "delivered";
    Status["ERROR"] = "error";
    Status["SEEN"] = "seen";
    Status["SENDING"] = "sending";
    Status["SENT"] = "sent";
})(Status = exports.Status || (exports.Status = {}));
let Chatmsg = class Chatmsg {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Chatmsg.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Object }),
    __metadata("design:type", Object)
], Chatmsg.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Chatmsg.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Chatmsg.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Chatmsg.prototype, "remoteId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Chatmsg.prototype, "roomId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Chatmsg.prototype, "showStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: Status }),
    __metadata("design:type", String)
], Chatmsg.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: MessageType, required: true }),
    __metadata("design:type", String)
], Chatmsg.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Chatmsg.prototype, "updatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Chatmsg.prototype, "text", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Chatmsg.prototype, "uri", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Chatmsg.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Chatmsg.prototype, "size", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Chatmsg.prototype, "duration", void 0);
Chatmsg = __decorate([
    (0, mongoose_1.Schema)()
], Chatmsg);
exports.Chatmsg = Chatmsg;
exports.chatmsgShcema = mongoose_1.SchemaFactory.createForClass(Chatmsg);
//# sourceMappingURL=chat.entity.js.map