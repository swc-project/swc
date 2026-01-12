(function(Foo) {
    Foo.bar = 42;
    Foo.foo = function() {
        return 20;
    };
    function xyz() {
        return Foo.foo() * Foo.bar;
    }
    Foo.xyz = xyz;
})(Foo || (Foo = {}));
var Foo;
