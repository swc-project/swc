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
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
