function* foo() {
    yield x.foo;
    (yield x).foo;
    yield (yield obj.foo()).bar();
}
