function n(n, o) {
    try {
        const n = {};
        throw "PASS";
    } catch (n) {
        return o(n);
    }
}
console.log(n(null, (n) => n));
