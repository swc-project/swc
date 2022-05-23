console.log(
    {
        a: 42,
        p: function () {
            return this.a;
        },
    }.p()
);
