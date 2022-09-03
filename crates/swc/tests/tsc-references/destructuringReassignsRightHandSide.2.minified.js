//// [destructuringReassignsRightHandSide.ts]
var bar, ref, foo = {
    foo: 1,
    bar: 2
};
foo = (ref = foo).foo, bar = ref.bar;
var foo = foo.foo, baz = foo.baz;
