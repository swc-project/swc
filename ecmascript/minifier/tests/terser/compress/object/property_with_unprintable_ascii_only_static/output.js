class foo {
    static get "\x02\x03"() {
        return "bar";
    }
    static set "\x04\x05"(foo1) {
        save(foo1);
    }
}
