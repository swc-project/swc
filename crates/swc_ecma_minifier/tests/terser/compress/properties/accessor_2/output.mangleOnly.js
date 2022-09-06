console.log(
    {
        get a() {
            return "PASS";
        },
        set a(a) {},
        a: "FAIL",
    }.a
);
