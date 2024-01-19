//// [destructuringReassignsRightHandSide.ts]
var ref, foo = {
    foo: 1,
    bar: 2
};
ref = foo, foo = ref.foo, ref.bar;
var foo = foo.foo;
foo.baz;
