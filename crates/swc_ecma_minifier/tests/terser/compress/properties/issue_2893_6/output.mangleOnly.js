"use strict";
var s = {
    set a (v){
        this.b = v;
    },
    b: "FAIL"
};
s.a = "PASS";
console.log(s.b);
