console.log(
    new (function (a) {
        this.b = a;
    })(1).b,
    2
);
