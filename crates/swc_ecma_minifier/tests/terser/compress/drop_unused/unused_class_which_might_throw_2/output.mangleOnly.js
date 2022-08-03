let l = "FAIL";
try {
    class c {
        [ima_throw_lol()] = null;
    }
} catch (t) {
    l = "PASS";
}
console.log(l);
