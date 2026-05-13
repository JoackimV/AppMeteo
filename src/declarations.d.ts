declare module '*.css';

declare module 'openmeteo' {
    export function fetchWeatherApi(url: string, params: object): Promise<any[]>;
}