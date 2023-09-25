var Foo;
(function(Foo) {
    const { a } = { a: Foo.a } = {
        a: 1
    };
})(Foo || (Foo = {}));
