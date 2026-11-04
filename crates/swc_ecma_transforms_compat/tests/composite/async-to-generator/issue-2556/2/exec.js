async function foo(a) {
    return bar1;

    async function bar1(b) {
        return bar2;

        async function bar2(c) {
            return bar3;

            async function bar3(d) {
                return a + b + c + d;
            }
        }
    }
}

foo(1)
    .then((t) => t(2))
    .then((t) => t(3))
    .then((t) => t(4))
    .then(console.log);
