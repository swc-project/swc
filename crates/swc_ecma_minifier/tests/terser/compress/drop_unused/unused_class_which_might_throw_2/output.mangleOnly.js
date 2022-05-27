let a = "FAIL";
try {
    class b {
        [ima_throw_lol()] = null;
    }
} catch (c) {
    a = "PASS";
}
console.log(a);
