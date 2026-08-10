export function callback(value, Matcher) {
    const unused = value instanceof Matcher;
}

export function invalid() {
    const unused = 1 instanceof 2;
}

export function control() {
    const unused = 1 === 2;
}
