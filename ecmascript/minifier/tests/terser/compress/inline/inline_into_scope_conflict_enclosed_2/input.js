global.same_name = () => console.log("PASS");
function $(same_name) {
    console.log(same_name === undefined ? "PASS" : "FAIL");
    indirection_1();
}
function indirection_1() {
    return indirection_2();
}
function indirection_2() {
    for (const x of [1]) {
        same_name();
        return;
    }
}
$();
