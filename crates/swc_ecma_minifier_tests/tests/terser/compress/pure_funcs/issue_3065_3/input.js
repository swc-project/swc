function debug(msg) {
    console.log(msg);
}
debug(
    (function () {
        console.log("PASS");
        return "FAIL";
    })()
);
