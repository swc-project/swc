function n(n, o) {
    try {
        const t = {};
        throw "PASS";
    } catch (c) {
        return o(c);
    }
}
console.log(n(null, (n)=>n));
