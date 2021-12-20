// @strictNullChecks: true
function f1() {
    let x;
    x = 1;
    x = "abc";
    x = false;
    x = undefined;
    x = null;
    x = {
    };
    x();
}
function f2() {
    return;
}
function f3() {
    return 1;
}
function f4() {
}
for (const n of f4()){
}
for(const n1 in f4()){
}
