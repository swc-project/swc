async function f(q) {
    return q + 1;
}
function h(q) {
    return q + 2;
}
let k = ()=>3;
export function C(p) {
    return function(g = f) {
        return g;
    }(p.s);
}
export function D(p) {
    return function(g = h) {
        return g;
    }(p.s);
}
export function E(p) {
    return function(g = k) {
        return g;
    }(p.s);
}
let s = {};
console.log(C(s) === C(s), D(s) === D(s), E(s) === E(s));
