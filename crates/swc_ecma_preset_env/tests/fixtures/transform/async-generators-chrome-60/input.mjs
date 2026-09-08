export default async function* () {
    yield 1;
}

export const expression = async function* () {
    yield 2;
};

export async function* declaration() {
    yield 3;
}

export const probe = !!(async function* () {
    yield 4;
});

export const object = {
    async *method() {
        yield await Promise.resolve(5);
    },
};

export class C {
    async *method() {
        yield 6;
    }
}

export async function* values(iterable) {
    for await (const value of iterable) {
        yield value;
    }
}

export async function ordinary() {
    return await Promise.resolve(7);
}
