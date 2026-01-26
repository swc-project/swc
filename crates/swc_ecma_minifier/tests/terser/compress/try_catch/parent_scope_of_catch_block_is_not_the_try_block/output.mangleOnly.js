function o(o, r) {
    try {
        const o = {};
        throw "PASS";
    } catch (o) {
        return r(o);
    }
}
console.log(o(null, (o)=>o));
