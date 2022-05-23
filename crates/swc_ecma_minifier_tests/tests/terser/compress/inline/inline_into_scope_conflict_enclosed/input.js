global.same_name = "PASS";
function $(same_name) {
    if (same_name) indirection_1(same_name);
}
function indirection_2() {
    console.log(same_name);
}
function indirection_1() {
    indirection_2();
}
$("FAIL");
