console.log(
    {
        *p() {
            return x();
        },
    }.p()
);
console.log((async () => await x())());
