let a = "FAIL";
try {
    class b extends might_throw_lol() {
        constructor(){}
    }
} catch (c) {
    a = "PASS";
}
console.log(a);
