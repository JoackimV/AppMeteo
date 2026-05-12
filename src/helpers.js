// Helpers
export function buildTimeArray(series, utcOffsetSeconds) {
    if (!series) return null;
    const length = (Number(series.timeEnd()) - Number(series.time())) / series.interval();
    return Array.from({ length }, (_, i) =>
        new Date((Number(series.time()) + i * series.interval() + utcOffsetSeconds) * 1000)
    );
}

export function valuesArray(series, idx, round = false) {
    const variable = series?.variables(idx);
    if (!variable) return null;
    const arr = variable.valuesArray();
    return round ? Array.from(arr, v => Math.round(v)) : Array.from(arr);
}

export function currentValue(current, idx, round = false) {
    const v = current?.variables(idx)?.value();
    if (v == null) return null;
    return round ? Math.round(v) : v;
}

export function zipToObjects(timeArr, keys, arrays) {
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