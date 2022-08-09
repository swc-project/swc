function n(n) {
    console.log(n);
}
n((function() {
    console.log("PASS");
    return "FAIL";
})());
