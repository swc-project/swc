let x = "FAIL";
try {
    class X {
        static _ = ima_throw_lol();
    }
} catch (e) {
    x = "PASS";
}
console.log(x);
