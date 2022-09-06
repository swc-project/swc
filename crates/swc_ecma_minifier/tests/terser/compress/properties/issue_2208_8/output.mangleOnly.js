console.log(
    {
        *p() {
            return x();
        },
    }.p()
);
console.log(
    {
        async p() {
            return await x();
        },
    }.p()
);
