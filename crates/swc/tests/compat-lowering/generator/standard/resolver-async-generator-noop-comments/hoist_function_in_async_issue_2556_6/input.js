
async function foo(a) {
    return bar1;

    async function bar1(b) {
        return a + b;
    }
}

foo(1)
    .then((t) => t(2))
    .then(console.log);
