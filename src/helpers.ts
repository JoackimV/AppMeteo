// Helpers
export function buildTimeArray(series: any, utcOffsetSeconds: number): Date[] | null {
    if (!series) return null;
    const length = (Number(series.timeEnd()) - Number(series.time())) / series.interval();
    return Array.from({ length }, (_, i) =>
        new Date((Number(series.time()) + i * series.interval() + utcOffsetSeconds) * 1000)
    );
}

export function valuesArray(series: any, idx: number, round?: boolean): number[] | null {
    const variable = series?.variables(idx);
    if (!variable) return null;
    const arr = variable.valuesArray();
    return round ? Array.from(arr, v => Math.round(<number>v)) : Array.from(arr);
}

export function currentValue(current: any, idx: number, round?: boolean): number | null {
    const v = current?.variables(idx)?.value();
    if (v == null) return null;
    return round ? Math.round(v) : v;
}

export function zipToObjects<T extends Record<string, number | null>>(
    timeArr: Date[] | null,
    keys: string[],
    arrays: (number[] | null)[]
): (T & { time: Date })[] | null {
    if (!timeArr) return null;
    return timeArr.map((t, i) => {
        const obj: Record<string, number | Date | null> = { time: t };
        keys.forEach((k, j) => {
            const arr = arrays[j];
            obj[k] = Array.isArray(arr) ? arr[i] : null;
        });
        return obj as T & { time: Date };
    });
}