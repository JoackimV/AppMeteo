export interface CityInfo {
    latitude: number;
    longitude: number;
    name: string;
    country: string;
}

export interface CurrentWeather {
    time: Date;
    temperature_2m: number | null;
    precipitation: number | null;
    weather_code: number | null;
    wind_speed_10m: number | null;
    wind_direction_10m: number | null;
    apparent_temperature: number | null;
    latitude: number;
    longitude: number;
}

export interface HourlyWeather {
    time: Date[] | null;
    temperature_2m: number[] | null;
    weather_code: number[] | null;
    wind_speed_10m: number[] | null;
    wind_direction_10m: number[] | null;
    precipitation: number[] | null;
    entries: WeatherEntry[] | null;
}

export interface DailyWeather {
    time: Date[] | null;
    weather_code: number[] | null;
    temperature_2m_max: number[] | null;
    temperature_2m_min: number[] | null;
    entries: WeatherEntry[] | null;
}

export interface WeatherEntry {
    time: Date;
    temperature_2m: number | null;
    weather_code: number | null;
    wind_speed_10m?: number | null;
    wind_direction_10m?: number | null;
    precipitation?: number | null;
    temperature_2m_max?: number | null;
    temperature_2m_min?: number | null;
}

export interface WeatherData {
    city: { name: string; country: string } | null;
    current: CurrentWeather | null;
    hourly: HourlyWeather | null;
    daily: DailyWeather | null;
}