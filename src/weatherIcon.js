export const icon = {
    0: "bi-brightness-high",
    1: "bi-cloud-sun",
    2: "bi-cloud-sun",
    3: "bi-clouds",

    45: "bi-cloud-fog2",
    48: "bi-cloud-fog2",

    51: "bi-cloud-drizzle",
    53: "bi-cloud-drizzle",
    55: "bi-cloud-drizzle",
    56: "bi-cloud-sleet",
    57: "bi-cloud-sleet",

    61: "bi-cloud-rain",
    63: "bi-cloud-rain",
    65: "bi-cloud-rain-heavy",
    66: "bi-cloud-sleet",
    67: "bi-cloud-sleet",

    71: "bi-snow",
    73: "bi-snow",
    75: "bi-snow2",
    77: "bi-cloud-hail",

    80: "bi-cloud-rain",
    81: "bi-cloud-rain",
    82: "bi-cloud-rain-heavy",

    85: "bi-cloud-snow",
    86: "bi-cloud-snow",

    95: "bi-cloud-lightning-rain",
    96: "bi-cloud-hail",
    99: "bi-cloud-hail",
};

export function getIconByWeatherCode(code) {
    return icon[code] || "bi-question-circle";
}