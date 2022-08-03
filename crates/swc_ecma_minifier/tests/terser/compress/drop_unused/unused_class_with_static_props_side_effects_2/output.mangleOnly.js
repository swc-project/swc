let t = "FAIL";
function c() {
    t = "PASS";
}
class l {
    static _ = c();
}
console.log(t);
