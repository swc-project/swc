declare function error4(message: string): never;

declare function fail4() : never;

function failOrThrow4(shouldFail: boolean) {
    if (shouldFail) {
        return fail4();
    }
    throw new Error();
}