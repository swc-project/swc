let l = "FAIL";
try {
    class t {
        get [ima_throw_lol()]() {
            return null;
        }
    }
} catch (o) {
    l = "PASS";
}
console.log(l);
