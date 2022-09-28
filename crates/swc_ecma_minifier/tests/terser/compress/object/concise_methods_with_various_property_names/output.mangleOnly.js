var r = "bar";
var e = {
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
    10 (r) {
        this._ten = r;
    }
};
