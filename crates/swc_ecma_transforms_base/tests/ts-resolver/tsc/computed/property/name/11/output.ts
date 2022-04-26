var s__1: string;
var n__1: number;
var a__1: any;
var v__1 = {
    get [s__1] () {
        return 0;
    },
    set [n__1] (v__2){},
    get [s__1 + s__1] () {
        return 0;
    },
    set [s__1 + n__1] (v__3){},
    get [+s__1] () {
        return 0;
    },
    set [""] (v__4){},
    get [0] () {
        return 0;
    },
    set [a__1] (v__5){},
    get [<any>true] () {
        return 0;
    },
    set [`hello bye`] (v__6){},
    get [`hello ${a__1} bye`] () {
        return 0;
    }
};
