function bar(...args) {
    return args;
}
f1("foo", "abc"), f1("foo", 10, !0), f1("foo", ...t1), f1("foo", ...t2), f1("foo", ...t3), f1("foo", ...t4), f1("foo", 10), f1("foo"), f2 = f1, f3 = f1, f4 = f1, f1 = f2, f1 = f3, f1 = f4, foo(), foo(100), foo(foo), bar(10, 20), bar(10, 20), baz(), baz(1), baz(1, 2), baz(...ca), hmm(), hmm(1, "s"), hmm("what"), foo2(...[
    "hello"
]);
