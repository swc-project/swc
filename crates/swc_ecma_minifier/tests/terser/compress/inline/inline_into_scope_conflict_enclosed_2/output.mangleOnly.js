global.same_name = ()=>console.log("PASS");
function n(n) {
    console.log(n === undefined ? "PASS" : "FAIL");
    o();
}
function o() {
    return t();
}
function t() {
    for (const n of [
        1
    ]){
        same_name();
        return;
    }
}
n();
