import * as Typia from "typia";

export function dateReviver(...keys: string[]) {
    const keySet = new Set(keys);

    return (key: string, val: string) => {
        if (!keySet.has(key))
            return val;

        const date = Date.parse(val);
        if (isNaN(date))
            throw new RangeError(`Key "${key}" has non-date value`);
        return new Date(date);
    };
}

export function req(resource: string, options?: RequestInit | undefined) {
    const destination = new URL(resource, import.meta.env.VITE_PROXY);
    
    options ??= {};
    options.credentials ??= "include";

    return fetch(destination, options);
}

export type Reviver = (key: string, value: string) => unknown;

export function get<T>(resource: string, validate: (input: T) => Typia.IValidation<T>, reviver?: Reviver) {
    return req(resource).then(async res => {
        if (res.status != 200)
            throw new Error(`${res.status}: ${res.statusText}`);

        const text = await res.text();
        const body = JSON.parse(text, reviver);

        const result = validate(body);
        if (!result.success) {
            const errors = JSON.stringify(result.errors);
            throw new Error(`Backend response was in an unexpected format: ${errors}`);
        }

        return body as T;
    });
}

export function post(resource: string, body: unknown)
{
    const options: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    };

    return req(resource, options);
}
