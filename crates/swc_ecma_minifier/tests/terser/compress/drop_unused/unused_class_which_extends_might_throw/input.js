let x = "FAIL";
try {
    class X extends might_throw_lol() {
        constructor() {}
    }
} catch (e) {
    x = "PASS";
}
console.log(x);
