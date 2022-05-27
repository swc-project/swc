var a = "bar";
var b = {
    bar () {
        return this.get;
    },
    5 () {
        return "five";
    },
    3925 () {
        return "f five five";
    },
    five () {
        return 5;
    },
    10 (a) {
        this._ten = a;
    }
};
