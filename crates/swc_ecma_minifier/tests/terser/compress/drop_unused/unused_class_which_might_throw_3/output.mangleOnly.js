let l = "FAIL";
try {
    class o {
        [ima_throw_lol()]() {
            return null;
        }
    }
} catch (t) {
    l = "PASS";
}
console.log(l);
