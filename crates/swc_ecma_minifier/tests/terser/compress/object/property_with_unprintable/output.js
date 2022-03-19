var foo1 = {
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
class bar {
    get "\0"() {
        return "bar";
    }
    set "\0"(foo) {
        save(foo);
    }
    *"\0"() {
        return "foobar";
    }
}
