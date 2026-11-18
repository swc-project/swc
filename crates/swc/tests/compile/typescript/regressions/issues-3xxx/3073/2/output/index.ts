(function(Foo) {
    var ref;
    ref = {
        a: 1,
        b: 2
    }, Foo.A = ref.a, Foo.B = ref.b, ref;
})(Foo || (Foo = {}));
var Foo;
