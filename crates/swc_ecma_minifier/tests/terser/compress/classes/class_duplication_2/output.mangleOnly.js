class o {
    foo() {
        leak(new o());
    }
}
leak(o);
