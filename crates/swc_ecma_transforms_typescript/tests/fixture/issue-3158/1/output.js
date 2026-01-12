(function(Foo) {
    Foo.bar = 42;
    Foo.foo = function() {
        return 20;
    };
    function xyz() {
        return foo() * bar;
    }
    Foo.xyz = xyz;
})(Foo || (Foo = {}));
