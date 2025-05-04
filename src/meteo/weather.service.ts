import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WeatherService {
  private readonly API_KEY = '0f98fafaa222a1788a3f85dfd828263a';  // Replace with your OpenWeatherMap API key
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';  // OpenWeatherMap API endpoint

  async getWeatherByCoordinates(lat: number, lon: number): Promise<any> {
    try {
      const response = await axios.get(`${this.BASE_URL}`, {
        params: {
          lat, // Latitude
          lon, // Longitude
          appid: this.API_KEY, // API key
          units: 'metric', // Use metric units (Celsius)
          lang: 'en', // Use English for weather descriptions
        },
      });

      if (response.data.cod !== 200) {
        throw new HttpException(response.data.message, HttpStatus.BAD_REQUEST);
      }

      // Return weather data
      return {
        description: response.data.weather[0].description,
        temperature: response.data.main.temp,
        icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
        sunrise: response.data.sys.sunrise,
        sunset: response.data.sys.sunset,
        dt: response.data.dt,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error fetching weather data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
