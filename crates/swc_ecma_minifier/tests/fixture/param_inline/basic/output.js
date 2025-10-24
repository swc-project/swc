// Basic parameter inlining - undefined parameter
function complex(foo, fn) {
    if (Math.random() > 0.5) throw Error();
    return fn?.(foo);
}
console.log(complex("foo"));
console.log(complex("bar"));
console.log(complex("baz"));
