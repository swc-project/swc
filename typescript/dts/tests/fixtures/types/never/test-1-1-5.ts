function error(message: string): never {
    throw new Error(message);
}

function check<T>(x: T | undefined) {
    return x || error("Undefined value");
}
