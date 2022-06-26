function a(a, b) {
    try {
        const c = {};
        throw "PASS";
    } catch (d) {
        return b(d);
    }
}
console.log(a(null, (a)=>a));
