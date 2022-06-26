var Foo;
(function(Foo) {
    var bar = Foo.bar = 42;
    var foo = Foo.foo = function() {
        return 20;
    };
    function xyz() {
        return foo() * bar;
    }
    Foo.xyz = xyz;
})(Foo || (Foo = {}));
