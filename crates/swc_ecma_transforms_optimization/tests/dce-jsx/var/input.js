function A() {
    return "a";
}
const b = "b";
const c = "c";
export function d() {
    return <A val={b}>{c}</A>;
}
