!(function a() {
    a.foo += "";
    if (a.foo) console.log("PASS");
    else console.log("FAIL");
})();
