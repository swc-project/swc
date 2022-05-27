var a = {
    "\0": "foo",
    get "\0" () {
        return "bar";
    },
    set "\0" (foo){
        save(foo);
    },
    *"\0" () {
        return "foobar";
    }
};
class b {
    get "\0"() {
        return "bar";
    }
    set "\0"(a) {
        save(a);
    }
    *"\0"() {
        return "foobar";
    }
}
