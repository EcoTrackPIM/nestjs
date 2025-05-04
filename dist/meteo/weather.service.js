"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let WeatherService = class WeatherService {
    constructor() {
        this.API_KEY = '0f98fafaa222a1788a3f85dfd828263a';
        this.BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
    }
    async getWeatherByCoordinates(lat, lon) {
        try {
            const response = await axios_1.default.get(`${this.BASE_URL}`, {
                params: {
                    lat,
                    lon,
                    appid: this.API_KEY,
                    units: 'metric',
                    lang: 'en',
                },
            });
            if (response.data.cod !== 200) {
                throw new common_1.HttpException(response.data.message, common_1.HttpStatus.BAD_REQUEST);
            }
            return {
                description: response.data.weather[0].description,
                temperature: response.data.main.temp,
                icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
                sunrise: response.data.sys.sunrise,
                sunset: response.data.sys.sunset,
                dt: response.data.dt,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.message || 'Error fetching weather data', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
WeatherService = __decorate([
    (0, common_1.Injectable)()
], WeatherService);
exports.WeatherService = WeatherService;
//# sourceMappingURL=weather.service.js.map