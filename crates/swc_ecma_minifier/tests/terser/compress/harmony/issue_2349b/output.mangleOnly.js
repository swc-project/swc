function n(n, t) {
    const o = n.get();
    return o.map(function ({ [t]: n }) {
        return n;
    });
}
console.log(
    n(
        {
            get: function () {
                return [{ blah: 42 }];
            },
        },
        "blah"
    )
);
