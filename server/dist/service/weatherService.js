import dotenv from 'dotenv';
dotenv.config();
// Class for the Weather object
class Weather {
    constructor(city, date, icon, iconDescription, tempF, windSpeed, humidity) {
        this.city = city;
        this.date = date;
        this.icon = icon;
        this.iconDescription = iconDescription;
        this.tempF = tempF;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
    }
}
// WeatherService class
class WeatherService {
    // fetchLocationData method
    // private async fetchLocationData(query: string) {}
    async fetchLocationData(query) {
        const response = await fetch(`${this.baseURL}/geo/1.0direct?${query}`);
        if (!response.ok) {
            console.log('could not fetch location data');
            return [];
        }
        else {
            const coordinates = await response.json();
            return coordinates;
        }
    }
    // destructureLocationData method
    // private destructureLocationData(locationData: Coordinates): Coordinates {}
    destructureLocationData(locationData) {
        try {
            const lat = locationData[0].lat;
            const lon = locationData[0].lon;
            return { lat: lat, lon: lon };
        }
        catch (error) {
            console.error(`location not found`);
            this.cityName = `location not found`;
            return { lat: 90, lon: 0 };
        }
    }
    // buildGeocodeQuery method
    // private buildGeocodeQuery(): string {}
    buildGeocodeQuery() {
        return `q=${this.cityName}&limit=1&appid=${this.apiKey}`;
    }
    // buildWeatherQuery method
    // private buildWeatherQuery(coordinates: Coordinates): string {}
    buildWeatherQuery(coordinates) {
        return `lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    }
    // fetchAndDestructureLocationData method
    // private async fetchAndDestructureLocationData() {}
    async fetchWeatherData(coordinates) {
        const currentWeather = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?${this.buildWeatherQuery(coordinates)}`)).json();
        const forecast = await (await fetch(`https://api.openweathermap.org/data/2.5/forecast?${this.buildWeatherQuery(coordinates)}`)).json();
        return { currentWeather: currentWeather, forecast: forecast };
    }
    // fetchWeatherData method
    // private async fetchWeatherData(coordinates: Coordinates) {}
    parseCurrentWeather(response) {
        const current = response;
        let name;
        if (this.cityName === `location not found`) {
            name = `Location not found, here's the north pole instead!`;
        }
        else {
            name = response.name;
        }
        return new Weather(name, `${(new Date()).toDateString()}`, current.weather[0].icon, current.weather[0].description, current.main.temp, current.wind.speed, current.main.humidity);
    }
    // parseCurrentWeather method
    // private parseCurrentWeather(response: any) {}
    parseForecast(response) {
        const daysUnfiltered = response.list;
        const days = daysUnfiltered.filter((entry) => entry.dt_txt.includes(`12:00:00`));
        const forecast = [];
        let name;
        if (this.cityName === `location not found`) {
            name = `Location not found`;
        }
        else {
            name = response.name;
        }
        for (const day of days) {
            const weather = new Weather(name, day.dt_txt.slice(0, -9), day.weather[0].icon, day.weather[0].description, day.main.temp, day.wind.speed, day.main.humidity);
            forecast.push(weather);
        }
        return forecast;
    }
    // TODO: Complete buildForecastArray method
    // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
    buildForecastArray(currentWeather, weatherData) {
        const weatherArray = [currentWeather];
        weatherArray.push(...weatherData);
        return weatherArray;
    }
    // getWeatherForCity method
    // async getWeatherForCity(city: string) {}
    async getWeatherForCity() {
        try {
            const locationData = await this.fetchAndDestructureLocationData();
            const combinedWeatherData = await this.fetchWeatherData(locationData);
            const current = this.parseCurrentWeather(combinedWeatherData.currentWeather);
            const forecast = this.parseForecast(combinedWeatherData.forecast);
            const weather = this.buildForecastArray(current, forecast);
            return weather;
        }
        catch (error) {
            console.error(`there was an error getting weather data`);
            return;
        }
    }
}
export default new WeatherService();
