a = "PASS";
console.log(
    {
        a: "FAIL",
        b: function () {
            return (function (c) {
                return c.a;
            })(
                (String,
                Object,
                (function () {
                    return this;
                })())
            );
        },
    }.b()
);
