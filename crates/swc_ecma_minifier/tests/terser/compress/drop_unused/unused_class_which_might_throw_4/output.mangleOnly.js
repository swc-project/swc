let l = "FAIL";
try {
    class l {
        get [ima_throw_lol()]() {
            return null;
        }
    }
} catch (t) {
    l = "PASS";
}
console.log(l);
