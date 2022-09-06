console.log(
    {
        *gen(e) {
            return yield e.toUpperCase(), 2;
        },
    }
        .gen("pass")
        .next().value
);
