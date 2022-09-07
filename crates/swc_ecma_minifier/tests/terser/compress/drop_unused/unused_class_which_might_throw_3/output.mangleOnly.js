let l = "FAIL";
try {
    class l {
        [ima_throw_lol()]() {
            return null;
        }
    }
} catch (o) {
    l = "PASS";
}
console.log(l);
