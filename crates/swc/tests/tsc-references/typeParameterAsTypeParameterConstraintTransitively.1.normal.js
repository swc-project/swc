//// [typeParameterAsTypeParameterConstraintTransitively.ts]
// using a type parameter as a constraint for a type parameter is valid
// no errors expected
var a;
var b;
var c;
function foo(x, y, z) {
    return z;
}
//function foo<T, U extends T, V extends U>(x: T, y: U, z: V): V { return z; }
foo(1, 2, 3);
foo({
    x: 1
}, {
    x: 1,
    y: ''
}, {
    x: 2,
    y: '',
    z: true
});
foo(a, b, c);
foo(a, b, {
    foo: 1,
    bar: '',
    hm: true
});
foo(function(x, y) {}, function(x) {}, function() {});
function foo2(x, y, z) {
    return z;
}
//function foo2<T extends A, U extends T, V extends U>(x: T, y: U, z: V): V { return z; }
foo(a, a, a);
foo(a, b, c);
foo(b, b, {
    foo: 1,
    bar: '',
    hm: ''
});
