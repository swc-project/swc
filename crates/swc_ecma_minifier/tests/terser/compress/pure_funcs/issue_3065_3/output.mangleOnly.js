function a(a) {
    console.log(a);
}
a((function() {
    console.log("PASS");
    return "FAIL";
})());
