var r = {
    "*": 1,
    get "*"() {
        return 2;
    },
    *"*"() {
        return 3;
    },
    "%": 1,
    get "%"() {
        return 2;
    },
    *"%"() {
        return 3;
    },
};
class e {
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
