//// [objectLiteralGettersAndSetters.ts]
var callSig1, callSig2, callSig3, getter1, getter2, setter1, setter2, anyVar, sameName1a = {
    get a () {
        return "";
    },
    set a (n){
        var p = n;
    }
}, sameName2a = {
    get 0.0 () {
        return "";
    },
    set 0 (n){
        var p1 = n;
    }
}, sameName3a = {
    get 0x20 () {
        return "";
    },
    set 3.2e1 (n){
        var p2 = n;
    }
}, sameName4a = {
    get "" () {
        return "";
    },
    set "" (n){
        var p3 = n;
    }
}, sameName5a = {
    get "	" () {
        return "";
    },
    set "	" (n){
        var p4 = n;
    }
}, sameName6a = {
    get a () {
        return "";
    },
    set a (n){
        var p5 = n;
    }
}, callSig1 = {
    num: function(n1) {
        return "";
    }
}, callSig2 = {
    num: function(n1) {
        return "";
    }
}, callSig3 = {
    num: function(n1) {
        return "";
    }
}, getter1 = {
    get x () {
        return;
    }
}, getter2 = {
    get x () {
        return "";
    }
}, setter1 = {
    set x (n){}
}, setter2 = {
    set x (n){}
}, sameType1 = {
    get x () {
        return;
    },
    set x (n){}
}, sameType2 = {
    get x () {
        return;
    },
    set x (n){}
}, sameType3 = {
    get x () {
        return;
    },
    set x (n){}
}, sameType4 = {
    get x () {
        return;
    },
    set x (n){}
}, setParamType1 = {
    set n (x){},
    get n () {
        return function(t) {};
    }
}, setParamType2 = {
    get n () {
        return function(t) {};
    },
    set n (x){}
}, getParamType1 = {
    set n (x){
        var y = x;
    },
    get n () {
        return "";
    }
}, getParamType2 = {
    get n () {
        return "";
    },
    set n (x){
        var y1 = x;
    }
}, getParamType3 = {
    get n () {
        return "";
    },
    set n (x){
        var y2 = x;
    }
};
