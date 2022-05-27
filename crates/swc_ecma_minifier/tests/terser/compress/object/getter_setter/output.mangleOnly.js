var a = "bar";
var b = {
    get: a,
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
var c = {
    get () {
        return "gift";
    },
    set: function(a) {
        return "Storing code " + a;
    }
};
var d = {
    ["get"]: "foo",
    ["set"]: "bar"
};
var e = {
    get: "foo",
    set: "bar"
};
