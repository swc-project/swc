var Foo;
(function(Foo1) {
    ({ a: Foo1.a  } = {
        a: 1
    });
})(Foo || (Foo = {
}));
