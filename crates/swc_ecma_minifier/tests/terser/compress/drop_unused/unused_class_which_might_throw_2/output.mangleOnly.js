let l = "FAIL";
try {
    class o {
        [ima_throw_lol()] = null;
    }
} catch (c) {
    l = "PASS";
}
console.log(l);
