var r = {
    "\0": "foo",
    get "\0"() {
        return "bar";
    },
    set "\0"(r) {
        save(r);
    },
    *"\0"() {
        return "foobar";
    },
};
class e {
    get "\0"() {
        return "bar";
    }
    set "\0"(r) {
        save(r);
    }
    *"\0"() {
        return "foobar";
    }
}
