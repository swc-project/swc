function error(message: string): never {
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