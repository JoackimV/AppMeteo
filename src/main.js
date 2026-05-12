import './style.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './weatherData.js'
import {weatherData} from "./weatherData.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getIconByWeatherCode } from "./weatherIcon";

document.querySelector('#app').innerHTML = `
<main class="container-fluid">
    <h1 class="text-center">App Meteo</h1>
    <div class="row">
    <div class="col-4">
        <div class="card">
        <div class="card-header">
        <h5>Prévisions sur 4 jours</h5>
</div>
<div class="card-body">
        <table class="table">
            <tbody id="dailyForecast">
            </tbody>
</table>
</div>
</div>
    </div>
    <div class="col-4">
    <div class="card">
        <div class="card-header d-flex flex-column align-items-center">
            <h3>Paris</h3>
            <div class="row" id="temp"></div>
            <div class="row" id="precip"></div>
            <div class="row" id="windSpeed"></div>
            <div class="row windDirec" id="windDirec"></div>
        </div>
        <div class="card-body d-flex flex-column align-items-center w-100">
            <div class="card w-100">
                <div class="card-header">
                    <h5>Prévisions heure par heure</h5>
                </div>
                <div class="card-body overflow-x-auto overflow-y-hidden w-100">
                    <div class="row flex-nowrap" style="height: fit-content; width: fit-content;" id="hourlyForecast"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-4">
    </div>
    </div>
    </div>
</main>
`

const current = weatherData.current;
const hourly = weatherData.hourly;
const daily = weatherData.daily;

const now = new Date();

if (current) {
    document.querySelector("#temp").innerHTML = `<i class="bi bi-water iconCurrent"></i> ${current.temperature_2m}°C`;
    document.querySelector("#precip").innerHTML = `<i class="bi bi-thermometer-half iconCurrent"></i> ${current.precipitation}mm`;
    document.querySelector("#windSpeed").innerHTML = `<i class="bi bi-wind iconCurrent"></i> ${current.wind_speed_10m}km/h`;
    document.querySelector("#windDirec").style.transform = `rotate(${current.wind_direction_10m}deg)`;
}

const nowIndex = hourly.time.findIndex(
    (time) => time.getTime() >= now.getTime()
);

for (let i = nowIndex - 1; i < (nowIndex + 24); i++) {
    const forecast = document.createElement("div");
    forecast.classList.add("col", "d-flex", "flex-column", "align-items-center");

    const date = new Date(hourly.time[i]);
    const timeLabel = (i === nowIndex - 1) ? "Maint." : date.getHours() + "h";
    const windDir = hourly.wind_direction_10m[i];

    forecast.innerHTML = `
        <div><strong>${timeLabel}</strong></div>
        <div>${hourly.temperature_2m[i]}°C</div>
        <div><i class="bi ${getIconByWeatherCode(hourly.weather_code[i])}"></i></div>
        <div>${hourly.weather_code[i]}%</div>
        <div>${hourly.wind_speed_10m[i]}km/h</div>
        <div class="windDirec" style="transform: rotate(${windDir}deg);"></div>
    `;
    document.querySelector("#hourlyForecast").appendChild(forecast);
}

for (let i = 0; i < daily.time.length; i++) {
    const forecast = document.createElement("tr");

    const date = new Date(daily.time[i]);
    const dayLabel = date.getDay() === now.getDay() ? "auj." : date.toLocaleDateString("fr-FR", { weekday: "long"});

    forecast.innerHTML = `
        <td>${dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1)}</td>
        <td><i class="bi ${getIconByWeatherCode(daily.weather_code[i])}"</i></td>
        <td>${daily.temperature_2m_max[i]}°C</td>
        <td>${daily.temperature_2m_min[i]}°C</td>
    `;
    document.querySelector("#dailyForecast").appendChild(forecast);
}