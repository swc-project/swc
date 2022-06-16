let a = "PASS";
function b() {
    return a;
}
function c() {
    a = {
        value: 42
    };
}
function d() {
    if (typeof somethingElse == "undefined") {
        const a = b();
        console.log(a);
    }
}
d();
