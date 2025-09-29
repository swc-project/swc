import o from "phantom";
const c = o();
const { a1: n, b1: t, c1: e = "c" } = c;
const { a2: s, b2: f, c2: l = "c" } = undeclared;
const { a3: r, b3: a, c3: d = "c" } = window;
function i({ a: o, b: c, c: n = "c", d: t }) {
    console.log(t);
}
i({
    a: "a",
    get b () {
        console.log("side effect of b");
        return "b";
    }
});