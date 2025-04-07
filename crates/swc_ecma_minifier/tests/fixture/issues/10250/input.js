export function example(value) {
    if (value === undefined) {
        return undefined;
    }

    if (someConditional()) {
        return value;
    }

    return doSomething(value);
}
