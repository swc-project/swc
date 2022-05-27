var a = {
    "*": 1,
    get "*" () {
        return 2;
    },
    *"*" () {
        return 3;
    },
    "%": 1,
    get "%" () {
        return 2;
    },
    *"%" () {
        return 3;
    }
};
class b {
    get "*"() {
        return 1;
    }
    *"*"() {
        return 2;
    }
    get "%"() {
        return 1;
    }
    *"%"() {
        return 2;
    }
}
