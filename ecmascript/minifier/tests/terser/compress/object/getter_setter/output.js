var get = "bar";
var a = {
    get: get,
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
    set 9 (value1){
        this._nine = value1;
    },
    set 10 (value2){
        this._ten = value2;
    },
    set eleven (value3){
        this._eleven = value3;
    }
};
var b = {
    get () {
        return "gift";
    },
    set: function(code) {
        return "Storing code " + code;
    }
};
var c = {
    ["get"]: "foo",
    ["set"]: "bar"
};
var d = {
    get: "foo",
    set: "bar"
};
