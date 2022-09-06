let t = "FAIL";
try {
    class t extends might_throw_lol() {
        constructor() {}
    }
} catch (o) {
    t = "PASS";
}
console.log(t);
