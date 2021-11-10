a = "FAIL";
console.log(
    {
        a: "PASS",
        b: function () {
            return ((c) => (String, Object, (() => this)()).a)();
        },
    }.b()
);
