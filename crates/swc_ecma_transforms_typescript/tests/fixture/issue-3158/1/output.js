var Foo;
(function(Foo1) {
    var bar = Foo1.bar = 42;
    var foo = Foo1.foo = function() {
        return 20;
    };
    function xyz() {
        return foo() * bar;
    }
    Foo1.xyz = xyz;
})(Foo || (Foo = {
}));
