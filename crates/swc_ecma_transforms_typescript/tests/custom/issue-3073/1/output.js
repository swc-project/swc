(function(Foo) {
    ({ a: Foo.a } = {
        a: 1
    });
})(Foo || (Foo = {}));
var Foo;
