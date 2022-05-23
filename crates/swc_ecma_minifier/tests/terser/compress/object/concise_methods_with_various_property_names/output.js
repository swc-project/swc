var get = "bar";
var a = {
    bar() {
        return this.get;
    },
    5() {
        return "five";
    },
    3925() {
        return "f five five";
    },
    five() {
        return 5;
    },
    10(value) {
        this._ten = value;
    },
};
