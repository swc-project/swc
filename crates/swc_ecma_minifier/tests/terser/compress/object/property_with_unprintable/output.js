var foo1 = {
    "\x00\x01": "foo",
    get "\x00\x01" () {
        return "bar";
    },
    set "\x00\x01" (foo){
        save(foo);
    },
    *"\x00\x01" () {
        return "foobar";
    }
};
class bar {
    get "\x00\x01"() {
        return "bar";
    }
    set "\x00\x01"(foo) {
        save(foo);
    }
    *"\x00\x01"() {
        return "foobar";
    }
}
