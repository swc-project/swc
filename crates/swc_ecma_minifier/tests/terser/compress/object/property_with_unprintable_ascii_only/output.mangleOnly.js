var $ = {
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
    set "\0\x01"($) {
        save($);
    }
    *"\0\x01"() {
        return "foobar";
    }
}
