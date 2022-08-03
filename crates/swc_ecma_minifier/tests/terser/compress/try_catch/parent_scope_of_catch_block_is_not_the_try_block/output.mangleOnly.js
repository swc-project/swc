function t(t, n) {
    try {
        const c = {};
        throw "PASS";
    } catch (o) {
        return n(o);
    }
}
console.log(t(null, (t)=>t));
