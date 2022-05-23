console.log(
    {
        get a() {
            var b;
            (b = true) && b.c;
            b = void 0;
        },
    }.a
);
