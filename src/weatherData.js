import { fetchWeatherApi } from "openmeteo";

const params = {
    latitude: 48.8534,
    longitude: 2.3488,
    daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
    hourly: ["temperature_2m", "weather_code", "wind_speed_10m", "wind_direction_10m", "precipitation"],
    models: "meteofrance_seamless",
    current: ["temperature_2m", "precipitation", "weather_code", "wind_speed_10m", "wind_direction_10m", "apparent_temperature"],
    timezone: "auto",
    forecast_days: 4,
};

const url = "https://api.open-meteo.com/v1/forecast";

const responses = await fetchWeatherApi(url, params);

const response = responses[0]
const latitude = response.latitude();
const longitude = response.longitude();
const elevation = response.elevation();
const timezone = response.timezone();
const timezoneAbbreviation = response.timezoneAbbreviation();
const utcOffsetSeconds = response.utcOffsetSeconds();

console.log("==== DEBUG ====")
console.log(
    `\nCoordinates: ${latitude}°N ${longitude}°E`,
    `\nElevation: ${elevation}m asl`,
    `\nTimezone: ${timezone} ${timezoneAbbreviation}`,
    `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`
);

const current = response.current();
const hourly = response.hourly();
const daily = response.daily();

// Helpers
function buildTimeArray(series, utcOffsetSeconds) {
    if (!series) return null;
    const length = (Number(series.timeEnd()) - Number(series.time())) / series.interval();
    return Array.from({ length }, (_, i) =>
        new Date((Number(series.time()) + i * series.interval() + utcOffsetSeconds) * 1000)
    );
}

function valuesArray(series, idx, round = false) {
    const variable = series?.variables(idx);
    if (!variable) return null;
    const arr = variable.valuesArray();
    return round ? Array.from(arr, v => Math.round(v)) : Array.from(arr);
}

function currentValue(current, idx, round = false) {
    const v = current?.variables(idx)?.value();
    if (v == null) return null;
    return round ? Math.round(v) : v;
}

function zipToObjects(timeArr, keys, arrays) {
    if (!timeArr) return null;
    return timeArr.map((t, i) => {
        const obj = { time: t };
        keys.forEach((k, j) => {
            const arr = arrays[j];
            obj[k] = Array.isArray(arr) ? arr[i] : null;
        });
        return obj;
    });
}

// Build structured data
export const weatherData = {
    current: current ? {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature_2m: currentValue(current, 0, true),
        precipitation: currentValue(current, 1, true),
        weather_code: currentValue(current, 2, false),
        wind_speed_10m: currentValue(current, 3, true),
        wind_direction_10m: currentValue(current, 4, true),
        apparent_temperature: currentValue(current, 5, true),
    } : null,

    hourly: hourly ? (() => {
        const time = buildTimeArray(hourly, utcOffsetSeconds);
        const temperature_2m = valuesArray(hourly, 0, true);
        const weather_code = valuesArray(hourly, 1, false);
        const wind_speed_10m = valuesArray(hourly, 2, true);
        const wind_direction_10m = valuesArray(hourly, 3, true);
        const precipitation = valuesArray(hourly, 4, true);

        // keys for zipToObjects in the same order as arrays below
        const keys = ['temperature_2m', 'weather_code', 'wind_speed_10m', 'wind_direction_10m', 'precipitation'];
        const arrays = [temperature_2m, weather_code, wind_speed_10m, wind_direction_10m, precipitation];

        return {
            time,
            temperature_2m,
            weather_code,
            wind_speed_10m,
            wind_direction_10m,
            precipitation,
            // optional convenient array of objects (24h can be sliced by caller)
            entries: zipToObjects(time, keys, arrays),
        };
    })() : null,

    daily: daily ? (() => {
        const time = buildTimeArray(daily, utcOffsetSeconds);
        const weather_code = valuesArray(daily, 0, false);
        const temperature_2m_max = valuesArray(daily, 1, true);
        const temperature_2m_min = valuesArray(daily, 2, true);

        const keys = ['weather_code', 'temperature_2m_max', 'temperature_2m_min'];
        const arrays = [weather_code, temperature_2m_max, temperature_2m_min];

        return {
            time,
            weather_code,
            temperature_2m_max,
            temperature_2m_min,
            entries: zipToObjects(time, keys, arrays),
        };
    })() : null,
};

console.log("==== DEBUG ====")
console.log(weatherData.current)
console.log(weatherData.hourly)
console.log(weatherData.daily)
