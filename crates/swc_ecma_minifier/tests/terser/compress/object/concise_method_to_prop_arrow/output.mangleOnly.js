console.log({ a: () => 1 }.a());
console.log({ a: () => 2 }.a());
console.log(
    {
        a() {
            return 3;
        },
    }.a()
);
console.log(
    {
        a() {
            return this.b;
        },
        b: 4,
    }.a()
);
