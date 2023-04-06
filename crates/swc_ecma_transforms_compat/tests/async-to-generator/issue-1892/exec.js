function* gen() {
    var firstTime = true;
    outer:
    while (true) {
        yield 0;
        try {
            while (true) {
                yield 1;
                if (firstTime) {
                    firstTime = false;
                    yield 2;
                    continue outer;
                } else {
                    yield 3;
                    break;
                }
            }
            yield 4;
            break;
        } finally {
            yield 5;
        }
        yield 6;
    }
    yield 7;
}

const iter = gen();
expect(iter.next()).toEqual({ value: 0, done: false });
expect(iter.next()).toEqual({ value: 1, done: false });
expect(iter.next()).toEqual({ value: 2, done: false });
expect(iter.next()).toEqual({ value: 5, done: false });
expect(iter.next()).toEqual({ value: 0, done: false });
expect(iter.next()).toEqual({ value: 1, done: false });
expect(iter.next()).toEqual({ value: 3, done: false });
expect(iter.next()).toEqual({ value: 4, done: false });
expect(iter.next()).toEqual({ value: 5, done: false });
expect(iter.next()).toEqual({ value: 7, done: false });
expect(iter.next()).toEqual({ value: undefined, done: true });
