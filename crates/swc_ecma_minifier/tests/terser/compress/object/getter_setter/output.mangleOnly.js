var e = "bar";
var t = {
    get: e,
    set: "foo",
    get bar() {
        return this.get;
    },
    get 5() {
        return "five";
    },
    get 3925() {
        return "f five five";
    },
    get five() {
        return 5;
    },
    set one(e) {
        this._one = e;
    },
    set 9(e) {
        this._nine = e;
    },
    set 10(e) {
        this._ten = e;
    },
    set eleven(e) {
        this._eleven = e;
    },
};
var r = {
    get() {
        return "gift";
    },
    set: function (e) {
        return "Storing code " + e;
    },
};
var n = { ["get"]: "foo", ["set"]: "bar" };
var i = { get: "foo", set: "bar" };
