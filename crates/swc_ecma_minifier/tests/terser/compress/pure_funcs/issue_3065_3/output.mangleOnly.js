function o(o) {
    console.log(o);
}
o(
    (function () {
        console.log("PASS");
        return "FAIL";
    })()
);
