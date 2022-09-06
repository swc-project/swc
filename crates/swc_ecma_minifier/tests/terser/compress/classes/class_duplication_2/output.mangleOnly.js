class a {
    foo() {
        leak(new a());
    }
}
leak(a);
