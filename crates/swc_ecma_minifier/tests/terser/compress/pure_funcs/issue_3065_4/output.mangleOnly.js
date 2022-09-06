var o = function (o) {
    console.log(o);
};
o(
    (function () {
        console.log("PASS");
        return "FAIL";
    })()
);
