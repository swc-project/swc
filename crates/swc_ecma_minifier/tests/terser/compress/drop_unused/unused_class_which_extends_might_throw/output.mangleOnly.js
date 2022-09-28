let t = "FAIL";
try {
    class o extends might_throw_lol() {
        constructor(){}
    }
} catch (c) {
    t = "PASS";
}
console.log(t);
