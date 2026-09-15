const saved = Object.defineProperty;
let calls = 0;
try {
    Object.defineProperty = function () {
        calls++;
        throw new Error("patched defineProperty");
    };
    for (let __proto__ = 0, read = () => __proto__;;) {
        __proto__ = function () {};
        console.log(__proto__.name, read());
        break;
    }
} catch (error) {
    console.log(error.message);
} finally {
    Object.defineProperty = saved;
}
console.log(calls);
