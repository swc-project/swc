const N = 260;
const A = 40 + N;
function f(w) {
    return A / w;
}
const S = f(621);
export function dyn(w) {
    return f(w) + S;
}
