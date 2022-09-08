var e = "bar";
var t = {
    get: e,
    set: "foo",
    get bar () {
        return this.get;
    },
    get 5 () {
        return "five";
    },
    get 3925 () {
        return "f five five";
    },
    get five () {
        return 5;
    },
    set one (value){
        this._one = value;
    },
    set 9 (value){
        this._nine = value;
    },
    set 10 (value){
        this._ten = value;
    },
    set eleven (value){
        this._eleven = value;
    }
};
var r = {
    get () {
        return "gift";
    },
    set: function(e) {
        return "Storing code " + e;
    }
};
var n = {
    ["get"]: "foo",
    ["set"]: "bar"
};
var i = {
    get: "foo",
    set: "bar"
};
