// @strict: true
// @declaration: true
f1("foo", "abc");
f1("foo", 10, true);
f1("foo", ...t1);
f1("foo", ...t2);
f1("foo", ...t3);
f1("foo", ...t4);
f1("foo", 10); // Error
f1("foo"); // Error
f2 = f1;
f3 = f1;
f4 = f1; // Error, misaligned complex rest types
f1 = f2; // Error
f1 = f3; // Error
f1 = f4; // Error, misaligned complex rest types
foo(); // Error
foo(100); // Error
foo(foo); // Error
function bar(...args) {
    return args;
}
let a = bar(10, 20);
let b = bar(10, 20); // Error
baz(); // Error
baz(1); // Error
baz(1, 2); // Error
baz(...ca); // Error
hmm(); // okay, A = []
hmm(1, "s"); // okay, A = [1, "s"]
hmm("what"); // no error?  A = [] | [number, string] ?
let x2 = [
    "hello"
];
foo2(...x2);
