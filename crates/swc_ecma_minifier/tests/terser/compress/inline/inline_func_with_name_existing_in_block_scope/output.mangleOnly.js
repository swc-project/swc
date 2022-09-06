let n = "PASS";
function e() {
    return n;
}
function o() {
    n = { value: 42 };
}
function t() {
    if (typeof somethingElse == "undefined") {
        const n = e();
        console.log(n);
    }
}
t();
