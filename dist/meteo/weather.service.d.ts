export declare class WeatherService {
    private readonly API_KEY;
    private readonly BASE_URL;
    getWeatherByCoordinates(lat: number, lon: number): Promise<any>;
}
