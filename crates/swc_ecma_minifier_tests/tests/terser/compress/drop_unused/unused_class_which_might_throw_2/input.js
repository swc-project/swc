let x = "FAIL";
try {
    class X {
        [ima_throw_lol()] = null;
    }
} catch (e) {
    x = "PASS";
}
console.log(x);
