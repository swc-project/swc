var a;
var b;
var c;
function foo(x, y, z) {
    return z;
}
//function foo<T, U extends T, V extends U>(x: T, y: U, z: V): V { return z; }
foo(1, 2, '');
foo({
    x: 1
}, {
    x: 1,
    y: ''
}, {
    x: 2,
    y: 2,
    z: true
});
foo(a, b, a);
foo(a, {
    foo: 1,
    bar: '',
    hm: true
}, b);
foo(function(x, y) {
}, function(x, y) {
}, function() {
});
function foo2(x, y, z) {
    return z;
}
//function foo2<T extends A, U extends T, V extends U>(x: T, y: U, z: V): V { return z; }
foo(b, a, c);
foo(c, c, a);
