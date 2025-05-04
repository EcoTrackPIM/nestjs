"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const mongoose_1 = require("@nestjs/mongoose");
const mailer_1 = require("@nestjs-modules/mailer");
const nestjs_twilio_1 = require("nestjs-twilio");
const media_module_1 = require("./media/media.module");
const jwt_1 = require("@nestjs/jwt");
const ocr_controller_1 = require("./ocr/ocr.controller");
const ocr_service_1 = require("./ocr/ocr.service");
const weather_controller_1 = require("./meteo/weather.controller");
const upload_controller_1 = require("./upload/upload.controller");
const weather_service_1 = require("./meteo/weather.service");
const upload_service_1 = require("./upload/upload.service");
const groq_module_1 = require("./groq.module");
const event_module_1 = require("./event/event.module");
const ai_module_1 = require("./AI/ai.module");
const chat_module_1 = require("./chat/chat.module");
const product_module_1 = require("./product/product.module");
const upload_module_1 = require("./upload/upload.module");
const scan_result_module_1 = require("./scan-result/scan-result.module");
const item_module_1 = require("./item/item.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            mongoose_1.MongooseModule.forRoot('mongodb://localhost/pim'),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: 'sandbox.smtp.mailtrap.io',
                    port: 587,
                    auth: {
                        user: 'a147c4ee293502',
                        pass: '58f901639df100',
                    },
                },
            }),
            media_module_1.MediaModule,
            {
                ...jwt_1.JwtModule.register({
                    secret: 'hesfgdhfh',
                    signOptions: { expiresIn: '10h' },
                }),
                global: true,
            },
            {
                ...nestjs_twilio_1.TwilioModule.forRoot({
                    accountSid: 'ACb910d21f1d160b978216e4a092bfa0eb',
                    authToken: 'dad55962d6ba6a9fe2807b5c8030ca82',
                }),
                global: true,
            },
            upload_module_1.UploadModule,
            chat_module_1.ChatModule,
            groq_module_1.GroqModule,
            event_module_1.EventModule,
            ai_module_1.AiModule,
            product_module_1.ProductModule,
            scan_result_module_1.ScanResultModule,
            item_module_1.ItemModule
        ],
        controllers: [app_controller_1.AppController, ocr_controller_1.OcrController, weather_controller_1.WeatherController, upload_controller_1.UploadController],
        providers: [app_service_1.AppService, ocr_service_1.OcrService, weather_service_1.WeatherService, upload_service_1.UploadService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map