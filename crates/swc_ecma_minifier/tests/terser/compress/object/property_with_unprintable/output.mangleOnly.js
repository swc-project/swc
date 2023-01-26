var x = {
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
class r {
    get "\0"() {
        return "bar";
    }
    set "\0"(x) {
        save(x);
    }
    *"\0"() {
        return "foobar";
    }
}
