import declare from "phantom";
const declared = declare();
const { c1 = "c" } = declared;
const { c2 = "c" } = undeclared;
const { c3 = "c" } = window;
function fn({ c = "c", d }) {
    console.log(d);
}
fn({
    a: "a",
    get b () {
        console.log("side effect of b");
        return "b";
    }
});
