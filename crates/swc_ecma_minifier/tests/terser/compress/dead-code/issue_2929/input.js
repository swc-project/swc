console.log(
    (function (a) {
        try {
            return (null.p = a = 1);
        } catch (e) {
            return a ? "PASS" : "FAIL";
        }
    })()
);
