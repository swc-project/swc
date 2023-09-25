var Foo;
(function(Foo) {
    const bar = Foo.bar = 42;
    const foo = Foo.foo = function() {
        return 20;
    };
    function xyz() {
        return foo() * bar;
    }
    Foo.xyz = xyz;
})(Foo || (Foo = {}));
