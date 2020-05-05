function error(message: string): never {
    throw new Error(message);
}

function errorVoid(message: string) {
    throw new Error(message);
}

function fail() {
    return error("Something failed");
}

function failOrThrow(shouldFail: boolean) {
    if (shouldFail) {
        return fail();
    }
    throw new Error();
}

function check<T>(x: T | undefined) {
    return x || error("Undefined value");
}
