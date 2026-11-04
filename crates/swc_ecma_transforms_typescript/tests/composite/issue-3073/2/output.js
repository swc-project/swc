(function(Bar) {
    ({ a: Bar.a, b: Bar.b } = {
        a: 1,
        b: 2
    });
})(Bar || (Bar = {}));
var Bar;
