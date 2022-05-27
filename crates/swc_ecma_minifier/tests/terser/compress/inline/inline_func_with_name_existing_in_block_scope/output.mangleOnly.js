let b = "PASS";
function c() {
    return b;
}
function d() {
    b = {
        value: 42
    };
}
function a() {
    if (typeof somethingElse == "undefined") {
        const a = c();
        console.log(a);
    }
}
a();
