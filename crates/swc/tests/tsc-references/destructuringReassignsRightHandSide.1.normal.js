//// [destructuringReassignsRightHandSide.ts]
var foo = {
    foo: 1,
    bar: 2
};
var bar;
var ref;
// reassignment in destructuring pattern
(ref = foo, foo = ref.foo, bar = ref.bar, ref);
// reassignment in subsequent var
var foo = foo.foo, baz = foo.baz;
