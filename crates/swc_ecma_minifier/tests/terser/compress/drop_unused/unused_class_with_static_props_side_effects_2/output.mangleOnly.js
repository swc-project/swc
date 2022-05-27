let a = "FAIL";
function b() {
    a = "PASS";
}
class c {
    static _ = b();
}
console.log(a);
