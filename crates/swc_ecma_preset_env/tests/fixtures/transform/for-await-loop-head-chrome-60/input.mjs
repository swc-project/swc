export async function direct() {
    const items = [1, 2];
    for await (let items of items) {}
}

export async function captured(source) {
    let getter;
    const callbacks = [];
    outer: inner: for await (const { item } of (getter = () => typeof item, source)) {
        callbacks.push(() => item);
        continue outer;
    }
    return [getter, callbacks];
}

export const suspended = async () => {
    let getter;
    for await (let [first, second] of await Promise.resolve((getter = () => [first, second], [[1, 2]]))) {
        return getter;
    }
};
