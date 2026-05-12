import './style.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './weatherData.js'
import {getWeatherData} from "./weatherData.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getIconByWeatherCode } from "./weatherIcon";
import "./cityLocation.js";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

document.querySelector('#app').innerHTML = `
<main class="container-fluid app-layout">
    <header class="d-flex flex-column align-items-center justify-content-center">
        <h1 id="title">App Meteo</h1>
        <div class="input-group w-25" id="searchCity">
            <input type="text" class="form-control" placeholder="Entrez une ville" aria-label="City name" id="cityInput">
            <i class="bi bi-search input-group-text"></i>
        </div>
    </header>
    <!-- Prévisions par jour -->
    <div class="card row-start-2 row-span-2">
        <div class="card-header">
            <h5 class="mb-0">Prévisions sur 13 jours</h5>
        </div>
        <div class="card-body">
            <table class="table mb-0 h-100">
                <tbody id="dailyForecast"></tbody>
            </table>
        </div>
    </div>
    <!-- Info ville -->
    <div class="card row-start-2">
        <div class="card-body d-flex flex-column justify-content-center align-items-center">
            <h1 class="mb-0 fs-2" id="cityName"></h1>
            <h3 class="fw-normal fs-4 mb-0" id="countryName"></h3>
            <div class="row fs-1" id="temp"></div>
            <div class="row gap-2">
                <div class="w-fit-content p-0" id="tempMax"></div>
                <div class="w-fit-content p-0" id="tempMin"></div>
            </div>
            <div class="row" id="precip"></div>
        </div>
    </div>
    <div class="card row-start-2 row-span-2">
        <div class="card-body p-0">
            <div id="map" style="width: 100%; height: 100%;"></div>
        </div>
    </div>
    <!-- Prévisions par heure -->
    <div class="card row-start-3 col-start-2 h-fit-content">
        <div class="card-header">
            <h5 class="mb-0">Prévisions heure par heure</h5>
        </div>
        <div class="card-body overflow-x-auto overflow-y-hidden w-100">
            <div class="row flex-nowrap fit-content" id="hourlyForecast"></div>
        </div>
    </div>
</main>
`

// Initialiser la carte une seule fois
const map = L.map('map').setView([48.8566, 2.3522], 5); // Paris par défaut

// Fond de carte (gratuit, sans clé API)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
}).addTo(map);

var myIcon = L.icon({
    iconUrl: 'geo-alt-fill.svg',
    iconSize: [30, 60],
    iconAnchor: [15, 45],
    popupAnchor: [0, -20],
});
// Marqueur de la ville actuelle
let marker = L.marker([48.8566, 2.3522], {icon: myIcon}).addTo(map);

let cityInput = document.querySelector("#cityInput");

async function loadWeather() {
    let city = cityInput.value.trim() === "" ? "Paris" : cityInput.value.trim();
    let weatherData = await getWeatherData(city);
    if (!weatherData) return;
    renderWeather(weatherData);
}

function renderWeather(weatherData) {
    let current = weatherData.current;
    let hourly = weatherData.hourly;
    let daily = weatherData.daily;
    let now = new Date();

    // Vider les anciens résultats
    document.querySelector("#hourlyForecast").innerHTML = "";
    document.querySelector("#dailyForecast").innerHTML = "";

    document.querySelector("#cityName").textContent = weatherData.city.name;
    document.querySelector("#countryName").textContent = weatherData.city.country;

    if (current) {
        document.querySelector("#temp").innerHTML = `${current.temperature_2m}°C`;
        document.querySelector("#precip").innerHTML = `<i class="bi bi-water iconCurrent p-0 me-2"></i> ${current.precipitation}mm`;
        //document.querySelector("#windSpeed").innerHTML = `<i class="bi bi-wind iconCurrent"></i> ${current.wind_speed_10m}km/h`;
        //document.querySelector("#windDirec").style.transform = `rotate(${current.wind_direction_10m}deg)`;
    }

    let nowIndex = hourly.time.findIndex(time => time.getTime() >= now.getTime());

    for (let i = nowIndex - 1; i < (nowIndex + 24); i++) {
        let forecast = document.createElement("div");
        forecast.classList.add("col", "d-flex", "flex-column", "align-items-center");

        let date = new Date(hourly.time[i]);
        let timeLabel = (i === nowIndex - 1) ? "Maint." : date.getHours() + "h";
        let windDir = hourly.wind_direction_10m[i];

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
        let forecast = document.createElement("tr");

        let date = new Date(daily.time[i]);
        let nowBool = date.getDate() === now.getDate();
        let dayLabel = nowBool ? "aujourd'hui" : date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric" });

        if (nowBool) {
            document.querySelector("#tempMax").innerHTML = `<i class="bi bi-arrow-up iconCurrent p-0"></i> ${daily.temperature_2m_max[i]}`;
            document.querySelector("#tempMin").innerHTML = `<i class="bi bi-arrow-down iconCurrent p-0"></i> ${daily.temperature_2m_min[i]}`;
        }

        forecast.innerHTML = `
        <td>${dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1)}</td>
        <td><i class="bi ${getIconByWeatherCode(daily.weather_code[i])}"</i></td>
        <td>${daily.temperature_2m_max[i]}°C</td>
        <td>${daily.temperature_2m_min[i]}°C</td>
    `;
        document.querySelector("#dailyForecast").appendChild(forecast);
    }

    const { lat, lng } = { lat: weatherData.current.latitude, lng: weatherData.current.longitude }

    marker.bindPopup(weatherData.city.name).openPopup();
    map.setView({ lat, lng }, 5);        // recentrer
    marker.setLatLng({ lat, lng });       // déplacer le marqueur
}

map.on('click', async (e) => {
    const { lat, lng } = e.latlng;

    // Reverse geocoding avec l'API open-meteo (ou Nominatim gratuit)
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
    const data = await res.json();
    const cityName = data.address.city || data.address.town || data.address.village;

    if (cityName) {
        cityInput.value = cityName;
        loadWeather();
    }
});

cityInput.addEventListener("input", loadWeather);
loadWeather(); // appel initial