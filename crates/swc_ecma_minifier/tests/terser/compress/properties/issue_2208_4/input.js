function foo() {}
console.log(
    {
        a: foo(),
        p: function () {
            return 42;
        },
    }.p()
);
