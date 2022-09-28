let l = "FAIL";
try {
    class t {
        static _ = ima_throw_lol();
    }
} catch (c) {
    l = "PASS";
}
console.log(l);
