//// [destructuringReassignsRightHandSide.ts]
var ref, foo = {
    foo: 1,
    bar: 2
};
foo = // reassignment in destructuring pattern
(ref = foo).foo, ref.bar;
// reassignment in subsequent var
var foo = foo.foo;
foo.baz;
