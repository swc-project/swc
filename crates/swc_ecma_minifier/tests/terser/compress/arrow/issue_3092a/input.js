console.log(
    {
        *gen(x) {
            return yield x.toUpperCase(), 2;
        },
    }
        .gen("pass")
        .next().value
);
