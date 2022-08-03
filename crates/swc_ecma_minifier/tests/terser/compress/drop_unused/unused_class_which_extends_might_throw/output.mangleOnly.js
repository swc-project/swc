let t = "FAIL";
try {
    class c extends might_throw_lol() {
        constructor(){}
    }
} catch (s) {
    t = "PASS";
}
console.log(t);
