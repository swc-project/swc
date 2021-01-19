function foo(boo, key) {
    const value = boo.get();
    return value.map(function ({ [key]: bar }) {
        return bar;
    });
}
console.log(
    foo(
        {
            get: function () {
                return [{ blah: 42 }];
            },
        },
        "blah"
    )
);
