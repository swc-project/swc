var foo1 = {
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
class bar {
    get "\0\x01"() {
        return "bar";
    }
    set "\0\x01"(foo) {
        save(foo);
    }
    *"\0\x01"() {
        return "foobar";
    }
}
