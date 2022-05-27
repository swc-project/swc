let a = "FAIL";
try {
    class b {
        get [ima_throw_lol()]() {
            return null;
        }
    }
} catch (c) {
    a = "PASS";
}
console.log(a);
