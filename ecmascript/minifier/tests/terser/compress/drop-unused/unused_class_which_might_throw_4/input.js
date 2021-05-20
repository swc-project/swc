let x = "FAIL";
try {
    class X {
        get [ima_throw_lol()]() {
            return null;
        }
    }
} catch (e) {
    x = "PASS";
}
console.log(x);
