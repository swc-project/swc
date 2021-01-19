let x = "FAIL";
function impure() {
    x = "PASS";
}
class Unused {
    static _ = impure();
}
console.log(x);
