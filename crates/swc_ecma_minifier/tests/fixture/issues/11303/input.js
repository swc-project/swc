// Issue #11303: Dead code elimination should remove unused lambda functions
// returned by higher-order functions when called with object instances

// Minimal test case
class Y {
    foo() {}
}

function t(a) {
    return () => a.foo();
}

// This should be completely eliminated since unused is never called
const unused = t(new Y);

// For comparison: this SHOULD be kept because it's actually used
class X {
    foo() {}
}

function t2(a) {
    return () => a.foo();
}

const used = t2(new X);
used(); // Actually invoked
