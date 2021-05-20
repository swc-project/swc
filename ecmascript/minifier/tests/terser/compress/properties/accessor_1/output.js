console.log(
    {
        a: "FAIL",
        get a() {
            return "PASS";
        },
    }.a
);
