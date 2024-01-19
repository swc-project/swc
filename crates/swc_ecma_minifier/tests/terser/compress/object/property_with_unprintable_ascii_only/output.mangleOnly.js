var r = {
    "\0\x01": "foo",
    get "\0\x01" () {
        return "bar";
    },
    set "\0\x01" (foo){
        save(foo);
    },
    *"\0\x01" () {
        return "foobar";
    }
};
class e {
    get "\0\x01"() {
        return "bar";
    }
    set "\0\x01"(r) {
        save(r);
    }
    *"\0\x01"() {
        return "foobar";
    }
}
