import './style.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './weatherData.ts'
import {getWeatherData} from "./weatherData.ts";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getIconByWeatherCode } from "./weatherIcon";
import "./cityLocation.ts";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { compassSVG } from "./compass.ts";
import { getIsLoading } from "./weatherData.ts";
import type {WeatherData} from "./types";

document.querySelector<HTMLElement>('#compass-container')!.innerHTML = compassSVG;

// Initialiser la carte une seule fois
const map = L.map('map', { zoomControl: false }).setView([48.8566, 2.3522], 5); // Paris par défaut

L.control.zoom({ position: 'topright' }).addTo(map);

// Fond de carte (gratuit, sans clé API)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

// Fond de carte (gratuit, sans clé API)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
}).addTo(map);

const myIcon = L.icon({
    iconUrl: 'geo-alt-fill.svg',
    iconSize: [30, 60],
    iconAnchor: [15, 45],
    popupAnchor: [0, -20],
});

// Marqueur de la ville actuelle
let marker = L.marker([48.8566, 2.3522], {icon: myIcon}).addTo(map);

let cityInput = document.querySelector<HTMLInputElement>("#cityInput")!;

async function loadWeather():Promise<void> {
    let city = cityInput.value.trim() === "" ? "Paris" : cityInput.value.trim();

    let loader = document.querySelector<HTMLElement>("#loader-container")!;
    let meteo = document.querySelector<HTMLElement>("#meteo")!;

    // Lancer le chargement
    getWeatherData(city).then(weatherData => {
        // appelé quand c'est fini
        loader.style.display = "none";
        meteo.style.display = "flex";
        if (weatherData) renderWeather(weatherData);
    });

    // Pendant le chargement
    if (getIsLoading()) {
        loader.style.display = "flex";
        meteo.style.display = "none";
    }
}

function renderWeather(weatherData: WeatherData) {
    let current = weatherData.current;
    let hourly = weatherData.hourly;
    let daily = weatherData.daily;
    let now = new Date();

    // Vider les anciens résultats
    document.querySelector<HTMLElement>("#hourlyForecast")!.innerHTML = "";
    document.querySelector<HTMLElement>("#dailyForecast")!.innerHTML = "";

    document.querySelector<HTMLElement>("#cityName")!.textContent = weatherData.city!.name;
    document.querySelector<HTMLElement>("#countryName")!.textContent = weatherData.city!.country;

    if (current) {
        document.querySelector<HTMLElement>("#temp")!.innerHTML = `${current.temperature_2m}°C`;
        document.querySelector<HTMLElement>("#precip")!.innerHTML = `<i class="bi bi-water iconCurrent p-0 me-2"></i> ${current.precipitation}mm`;
        //document.querySelector("#windSpeed").innerHTML = `<i class="bi bi-wind iconCurrent"></i> ${current.wind_speed_10m}km/h`;
        //document.querySelector("#windDirec").style.transform = `rotate(${current.wind_direction_10m}deg)`;

        document.querySelector<HTMLElement>("#needle")!.setAttribute("transform", `rotate(${current.wind_direction_10m}, 110, 110)`);
        document.querySelector<HTMLElement>("#spd")!.textContent = current.wind_speed_10m?.toString() ?? null;
    }

    let nowIndex: number = hourly!.time!.findIndex(time => time.getTime() >= now.getTime());

    for (let i = nowIndex - 1; i < (nowIndex + 24); i++) {
        let forecast = document.createElement("div");
        forecast.classList.add("col", "d-flex", "flex-column", "align-items-center", "gap-2");

        let date = new Date(hourly!.time![i]);
        let timeLabel = (i === nowIndex - 1) ? "Maint." : date.getHours() + "h";

        forecast.innerHTML = `
        <div><strong>${timeLabel}</strong></div>
        <div>${hourly!.temperature_2m![i]}°C</div>
        <div><i class="bi ${getIconByWeatherCode(hourly!.weather_code![i])}"></i></div>
    `;
        document.querySelector<HTMLElement>("#hourlyForecast")!.appendChild(forecast);
    }

    for (let i = 0; i < daily!.time!.length; i++) {
        let forecast = document.createElement("tr");

        let date = new Date(daily!.time![i]);
        let nowBool = date.getDate() === now.getDate();
        let dayLabel = nowBool ? "aujourd'hui" : date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric" });

        if (nowBool) {
            document.querySelector<HTMLElement>("#tempMax")!.innerHTML = `<i class="bi bi-arrow-up iconCurrent p-0"></i> ${daily!.temperature_2m_max![i]}`;
            document.querySelector<HTMLElement>("#tempMin")!.innerHTML = `<i class="bi bi-arrow-down iconCurrent p-0"></i> ${daily!.temperature_2m_min![i]}`;
        }

        forecast.innerHTML = `
        <td>${dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1)}</td>
        <td><i class="bi ${getIconByWeatherCode(daily!.weather_code![i])}"</i></td>
        <td>${daily!.temperature_2m_max![i]}°C</td>
        <td>${daily!.temperature_2m_min![i]}°C</td>
    `;
        document.querySelector<HTMLElement>("#dailyForecast")!.appendChild(forecast);
    }

    const { lat, lng } = { lat: weatherData!.current!.latitude, lng: weatherData!.current!.longitude }

    marker.bindPopup(weatherData!.city!.name).openPopup();
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
        await loadWeather();
    }
});

cityInput.addEventListener("input", loadWeather);
loadWeather().then(() => {}); // appel initial