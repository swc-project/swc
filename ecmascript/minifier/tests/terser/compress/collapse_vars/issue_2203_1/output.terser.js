a = "FAIL";
console.log(
    {
        a: "PASS",
        b: function () {
            return (function (c) {
                return c.a;
            })((String, Object, this));
        },
    }.b()
);
