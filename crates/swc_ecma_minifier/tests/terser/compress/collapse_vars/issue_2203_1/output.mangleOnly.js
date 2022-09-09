a = "FAIL";
console.log(
    {
        a: "PASS",
        b: function () {
            return (function (n) {
                return n.a;
            })((String, Object, this));
        },
    }.b()
);
