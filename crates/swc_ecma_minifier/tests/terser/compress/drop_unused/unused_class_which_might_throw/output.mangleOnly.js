let t = "FAIL";
try {
    class c {
        static _ = ima_throw_lol();
    }
} catch (a) {
    t = "PASS";
}
console.log(t);
