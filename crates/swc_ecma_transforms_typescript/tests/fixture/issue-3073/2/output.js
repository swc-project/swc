var Bar;
(function(Bar) {
    const { a, b } = { a: Bar.a, b: Bar.b } = {
        a: 1,
        b: 2
    };
})(Bar || (Bar = {}));
