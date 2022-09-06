a = "FAIL";
console.log(
    {
        a: "PASS",
        b: function () {
            return ((n) => n.a)((String, Object, (() => this)()));
        },
    }.b()
);
