a = "PASS";
console.log(
    {
        a: "FAIL",
        b: function () {
            return (function (c) {
                return (String,
                Object,
                (function () {
                    return this;
                })()).a;
            })();
        },
    }.b()
);
