var Baz;
(function(Baz1) {
    var baz = Baz1.baz = {
        a: 1,
        b: 2
    };
})(Baz || (Baz = {
}));
