var fib = function fib(n) {
    return 42;
};

async function init() {
    return fib;

    async function fib(n) {
        if (n <= 1) {
            return n;
        }
        const x = await fib(n - 1);
        const y = await fib(n - 2);
        return x + y;
    }
}

console.log("start");
init()
    .then((fib) => fib(10))
    .then(console.log)
    .finally(() => console.log("end"));
