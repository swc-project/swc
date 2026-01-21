function complex(foo) {
    var fn;
    // prevent inlining
    if (Math.random() > 0.5) throw Error();
    return fn?.(foo);
}
console.log(complex("foo")), console.log(complex("bar")), console.log(complex("baz"));
