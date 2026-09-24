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

export class D extends C {
    async *method(iterable) {
        const inner = async () => {
            for await (const item of iterable) {
                return super.method(item);
            }
        };
        yield await inner();
    }
}

export class E extends C {
    constructor() {
        super();
        this.consume = async (iterable) => {
            for await (const item of iterable) {
                this.value = item;
            }
        };
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

export async function getAll(iterable) {
    const results = [];
    for await (const item of iterable) {
        results.push(await Promise.resolve(item));
    }
    return results;
}

export async function labeled(iterable) {
    let count = 0;
    outer: inner: for await (const item of iterable) {
        if (item < 0) continue outer;
        count += item;
        if (count > 3) break inner;
    }
    return count;
}

export async function mutableBinding(iterable) {
    let total = 0;
    for await (let item of iterable) {
        item += 1;
        total += item;
    }
    return total;
}

export async function functionScopedBinding(iterable) {
    for await (var item of iterable) {
        if (item) break;
    }
    return item;
}

export const consume = async (iterable) => {
    for await (const item of iterable) {
        if (item) break;
    }
};

export const consumer = {
    async method(iterable) {
        for await (const item of iterable) {
            return item;
        }
    }
};

export async function* nested(iterable) {
    const inner = async function () {
        for await (const item of iterable) {
            return item;
        }
    };
    const innerArrow = async () => {
        const deepest = async () => {
            for await (const item of iterable) {
                return [this, arguments[0], item];
            }
        };
        return deepest();
    };
    yield await inner();
    yield await innerArrow();
}
