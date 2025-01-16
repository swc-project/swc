// Correct
export const foo = {
    [Symbol.iterator]: (): void => {},
    [Symbol.asyncIterator]: async (): Promise<void> => {},
    [globalThis.Symbol.iterator]: (): void => {},
    get [Symbol.toStringTag]() {
        return "foo";
    },
};

export abstract class Foo {
    [Symbol.iterator](): void {}
    async [Symbol.asyncIterator](): Promise<void> {}
    [globalThis.Symbol.iterator](): void {}
    get [Symbol.toStringTag]() {
        return "Foo";
    }
}

// OK because these are not exported

namespace Foo {
    const Symbol = {};
    const globalThis = {};

    export const foo = {
        [Symbol.iterator]: (): void => {},
        [globalThis.Symbol.iterator]: (): void => {},
    };
}

function bar(Symbol: {}, globalThis: {}) {
    return {
        [Symbol.iterator]: (): void => {},
        [globalThis.Symbol.iterator]: (): void => {},
    };
}

// Incorrect

export namespace Foo {
    const Symbol = {};
    const globalThis = {};

    export const foo = {
        [Symbol.iterator]: (): void => {},
        [globalThis.Symbol.iterator]: (): void => {},
    };
}

export function bar(Symbol: {}, globalThis: {}) {
    return {
        [Symbol.iterator]: (): void => {},
        [globalThis.Symbol.iterator]: (): void => {},
    };
}
