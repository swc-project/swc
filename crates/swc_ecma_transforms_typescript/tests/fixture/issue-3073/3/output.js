let Baz;
(function(Baz) {
    Baz.baz = {
        a: 1,
        b: 2
    };
})(Baz || (Baz = {}));
