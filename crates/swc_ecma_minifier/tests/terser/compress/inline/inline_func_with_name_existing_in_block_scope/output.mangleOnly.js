let n = "PASS";
function t() {
    return n;
}
function o() {
    n = {
        value: 42
    };
}
function f() {
    if (typeof somethingElse == "undefined") {
        const n = t();
        console.log(n);
    }
}
f();
