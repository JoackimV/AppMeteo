export async function getCityInfo(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=fr&format=json`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) return null; // ← sécurité

    const result = data.results[0];
    return {
        latitude: Math.round((result.latitude + Number.EPSILON) * 10000) / 10000,
        longitude: Math.round((result.longitude + Number.EPSILON) * 10000) / 10000,
        name: result.name,
        country: result.country,
    }
}