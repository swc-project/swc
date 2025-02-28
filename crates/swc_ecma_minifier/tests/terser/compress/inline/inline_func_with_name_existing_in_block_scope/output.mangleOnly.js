let e = "PASS";
function o() {
    return e;
}
function t() {
    e = {
        value: 42
    };
}
function n() {
    if (typeof somethingElse == "undefined") {
        const n = o();
        console.log(n);
    }
}
n();
