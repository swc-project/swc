console.log(
    {
        fn: function () {
            return this;
        },
    }.fn(),
    {
        fn: function () {
            return this;
        },
    }.fn(),
    {
        fn: function () {
            return this;
        },
    }.fn()
);
