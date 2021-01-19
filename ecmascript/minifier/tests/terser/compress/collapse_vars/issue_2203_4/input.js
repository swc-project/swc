a = "FAIL";
console.log(
    {
        a: "PASS",
        b: function () {
            return ((c) => c.a)((String, Object, (() => this)()));
        },
    }.b()
);
