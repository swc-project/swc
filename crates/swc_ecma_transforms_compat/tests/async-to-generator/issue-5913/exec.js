(() => {
    function* generator() {
        try {
            while (true) {
                yield "foo";
            }
        } finally {
            yield "bar";
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
})();