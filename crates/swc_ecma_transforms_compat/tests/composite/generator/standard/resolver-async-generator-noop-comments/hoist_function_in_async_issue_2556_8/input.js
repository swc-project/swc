
var fib = function fib() {
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
