import declare from "phantom";
const declared = declare();
const { a1, b1, c1 = "c" } = declared;
const { a2, b2, c2 = "c" } = undeclared;
const { a3, b3, c3 = "c" } = window;
function fn({ a, b, c = "c", d }) {
    console.log(d);
}
fn({
    a: "a",
    get b() {
        console.log("side effect of b");
        return "b";
    },
});
