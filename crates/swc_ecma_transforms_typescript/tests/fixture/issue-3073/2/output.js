var Bar;
(function(Bar1) {
    ({ a: Bar1.a , b: Bar1.b  } = {
        a: 1,
        b: 2
    });
})(Bar || (Bar = {
}));
