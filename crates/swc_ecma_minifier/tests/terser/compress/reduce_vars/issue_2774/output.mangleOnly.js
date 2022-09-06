console.log(
    {
        get a() {
            var o;
            (o = true) && o.c;
            o = void 0;
        },
    }.a
);
