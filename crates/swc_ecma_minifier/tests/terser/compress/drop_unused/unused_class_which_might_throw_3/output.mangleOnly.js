let l = "FAIL";
try {
    class t {
        [ima_throw_lol()]() {
            return null;
        }
    }
} catch (c) {
    l = "PASS";
}
console.log(l);
