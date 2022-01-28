var foo = {
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
class bar {
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
