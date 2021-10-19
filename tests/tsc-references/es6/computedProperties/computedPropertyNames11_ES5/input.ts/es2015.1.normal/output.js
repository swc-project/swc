// @target: es5
var s;
var n;
var a;
var v5 = {
    get [s] () {
        return 0;
    },
    set [n] (v){
    },
    get [s + s] () {
        return 0;
    },
    set [s + n] (v1){
    },
    get [+s] () {
        return 0;
    },
    set [""] (v2){
    },
    get [0] () {
        return 0;
    },
    set [a] (v3){
    },
    get [true] () {
        return 0;
    },
    set [`hello bye`] (v4){
    },
    get [`hello ${a} bye`] () {
        return 0;
    }
};
