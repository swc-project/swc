"use strict";
var a = {
    set a (v){
        this.b = v;
    },
    b: "FAIL"
};
a.a = "PASS";
console.log(a.b);
