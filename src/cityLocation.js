let isLoading;

export async function getCityInfo(city) {
    isLoading = true;
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=fr&format=json`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) return null; // ← sécurité

        const result = data.results[0];
        return {
            latitude: Math.round((result.latitude + Number.EPSILON) * 10000) / 10000,
            longitude: Math.round((result.longitude + Number.EPSILON) * 10000) / 10000,
            name: result.name,
            country: result.country,
        }
    } catch (error) {
        console.error("API Call Failed:", error.message);
    } finally {
        isLoading = false;
    }
}

export function getIsLoading() {
    return isLoading;
}