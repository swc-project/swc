class a {
    static get "\x02\x03"() {
        return "bar";
    }
    static set "\x04\x05"(a) {
        save(a);
    }
}
