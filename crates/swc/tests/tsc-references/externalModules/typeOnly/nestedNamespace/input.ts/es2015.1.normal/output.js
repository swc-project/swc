// @Filename: a.ts
export let types;
(function(types) {
    class A {
    }
    types.A = A;
})(types || (types = {
}));
