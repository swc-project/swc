var s: string;
var n: number;
var a: any;
var v = {
    get [s] () {
        return 0;
    },
    set [n] (v__2){
    },
    get [s + s] () {
        return 0;
    },
    set [s + n] (v__3){
    },
    get [+s] () {
        return 0;
    },
    set [""] (v__4){
    },
    get [0] () {
        return 0;
    },
    set [a] (v__5){
    },
    get [<any>true] () {
        return 0;
    },
    set [`hello bye`] (v__6){
    },
    get [`hello ${a} bye`] () {
        return 0;
    }
};
