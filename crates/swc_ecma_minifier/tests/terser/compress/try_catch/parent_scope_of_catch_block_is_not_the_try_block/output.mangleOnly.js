function a(c, a) {
    try {
        const d = {};
        throw "PASS";
    } catch (b) {
        return a(b);
    }
}
console.log(a(null, (a)=>a));
