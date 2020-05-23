function error5(message: string): never {
    throw new Error(message);
}

function check5<T>(x: T | undefined) {
    return x || error5("Undefined value");
}
