var a = 1;
!(function () {
    var a;
    a = 3;
    console.log("PASS");
})();
try {
    console.log(a);
} finally {
}
