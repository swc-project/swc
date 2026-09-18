var result, count = 0;
Object.defineProperty(Array.prototype, "0", {
    configurable: true,
    set(value) { count++; throw "inherited setter"; }
});
try {
    for (let i = 0, read = () => i; i < 1;) {
        i = 42;
        result = read();
        break;
    }
} finally {
    delete Array.prototype[0];
}
console.log(result, count);
