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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const groq_service_1 = require("../groq.service");
const mongoose_1 = require("@nestjs/mongoose");
const road_entity_1 = require("./entities/road.entity");
const mongoose_2 = require("mongoose");
const auth_guard_1 = require("../auth/auth.guard");
let AiController = class AiController {
    constructor(aiService, groqservice, roadTripModel) {
        this.aiService = aiService;
        this.groqservice = groqservice;
        this.roadTripModel = roadTripModel;
    }
    async getFeedback(body) {
        const { conversation } = body;
        console.log(conversation);
        const response = await this.groqservice.getClient().chat.completions.create({
            model: 'qwen-qwq-32b',
            messages: [
                { role: 'system', content: `you should generate a feddback summary for ecotrack conversation for the user and give quick feed back about the user, this is the conversation: ${conversation} ` },
            ]
        });
        console.log(response.choices[0].message.content);
        return response.choices[0].message.content;
    }
    async create(tripData, req) {
        const createdTrip = new this.roadTripModel({
            ...tripData,
            status: 'completed',
            date: new Date(),
            userId: req.userId
        });
        await createdTrip.save();
        const analysisPrompt = `
      Analyze this eco-friendly trip data and provide a short, friendly feedback (1-2 sentences max):
      - Distance traveled: ${tripData.distance} meters
      - CO2 emissions: ${tripData.co2Emissions} kg
      - Vehicle type: ${tripData.vehicleType}
      
      Consider these points:
      1. For distances under 1000m, suggest walking/cycling
      2. For medium distances (1-5km), comment on efficiency
      3. For long distances, suggest alternatives if emissions are high
      4. Compare emissions to average for the vehicle type
      5. Keep it positive and motivational
      
      Example responses:
      "Great short trip! Next time consider walking for such short distances."
      "Good efficiency for a diesel vehicle on this medium-length trip!"
      "Your electric vehicle made this trip with zero emissions - fantastic!"
    `;
        const response = await this.groqservice.getClient().chat.completions.create({
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            messages: [
                {
                    role: 'system',
                    content: 'You are an eco-friendly transportation assistant. Provide very short, helpful feedback about trip data.'
                },
                {
                    role: 'user',
                    content: analysisPrompt
                }
            ],
            temperature: 0.7,
        });
        const aiFeedback = response.choices[0]?.message?.content || "Thanks for tracking your trip!";
        return {
            trip: createdTrip,
            analysis: aiFeedback
        };
    }
};
__decorate([
    (0, common_1.Post)('feedback'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getFeedback", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.Protect),
    (0, common_1.Post)('roadtrip'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "create", null);
AiController = __decorate([
    (0, common_1.Controller)('ai'),
    __param(2, (0, mongoose_1.InjectModel)(road_entity_1.RoadTrip.name)),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        groq_service_1.GroqService,
        mongoose_2.Model])
], AiController);
exports.AiController = AiController;
//# sourceMappingURL=ai.controller.js.map