let c = "FAIL";
function l() {
    c = "PASS";
}
class o {
    static _ = l();
}
console.log(c);
