console.log(
    {
        f: function () {
            this.a = 42;
            return [this.a, !1];
        },
    }.f()[0]
);
