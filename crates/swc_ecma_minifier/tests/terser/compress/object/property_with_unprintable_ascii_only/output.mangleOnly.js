var x = {
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
class r {
    get "\0\x01"() {
        return "bar";
    }
    set "\0\x01"(x) {
        save(x);
    }
    *"\0\x01"() {
        return "foobar";
    }
}
