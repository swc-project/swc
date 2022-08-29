//// [destructuringReassignsRightHandSide.ts]
var ref, foo = {
    foo: 1,
    bar: 2
};
foo = (ref = foo).foo, ref.bar;
var foo = foo.foo;
foo.baz;
