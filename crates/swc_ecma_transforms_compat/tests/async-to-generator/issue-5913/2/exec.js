function* generator() {
    try {
        while (true) {
            yield "foo";
        }
    } finally {
    }
}

function test() {
    const gen = generator();
    console.log(gen.next().value);
    console.log(gen.next().value);
    console.log(gen.next().value);
    console.log(gen.next().value);
}

test();