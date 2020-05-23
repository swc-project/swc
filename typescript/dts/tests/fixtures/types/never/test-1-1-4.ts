function error4(message: string): never {
    throw new Error(message);
}

function fail4() {
    return error4("Something failed");
}

function failOrThrow4(shouldFail: boolean) {
    if (shouldFail) {
        return fail4();
    }
    throw new Error();
}