// Issue #11303: Dead code elimination should remove unused lambda functions
// returned by higher-order functions when called with object instances
// Minimal test case
var a, a1;
a = new class {
    foo() {}
}, (a1 = new // For comparison: this SHOULD be kept because it's actually used
class {
    foo() {}
}, ()=>a1.foo())();
 // Actually invoked
