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
import { compassSVG } from "./compass.js";

const appHTML = await fetch('../public/app.html').then(r => r.text());
document.querySelector('#app').innerHTML = appHTML;

document.querySelector('#compass-container').innerHTML = compassSVG;

// Initialiser la carte une seule fois
const map = L.map('map', { zoomControl: false }).setView([48.8566, 2.3522], 5); // Paris par défaut

L.control.zoom({ position: 'topright' }).addTo(map);

// Fond de carte (gratuit, sans clé API)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

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

        document.querySelector("#needle").setAttribute("transform", `rotate(${current.wind_direction_10m}, 110, 110)`);
        document.querySelector("#spd").textContent = current.wind_speed_10m;
    }

    let nowIndex = hourly.time.findIndex(time => time.getTime() >= now.getTime());

    for (let i = nowIndex - 1; i < (nowIndex + 24); i++) {
        let forecast = document.createElement("div");
        forecast.classList.add("col", "d-flex", "flex-column", "align-items-center", "gap-2");

        let date = new Date(hourly.time[i]);
        let timeLabel = (i === nowIndex - 1) ? "Maint." : date.getHours() + "h";

        console.log(timeLabel);
        console.log(hourly.temperature_2m[i]);

        forecast.innerHTML = `
        <div><strong>${timeLabel}</strong></div>
        <div>${hourly.temperature_2m[i]}°C</div>
        <div><i class="bi ${getIconByWeatherCode(hourly.weather_code[i])}"></i></div>
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