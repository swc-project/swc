//// [objectLiteralGettersAndSetters.ts]
// Get and set accessor with the same name
var sameName1a = {
    get 'a' () {
        return '';
    },
    set a (n){
        var p = n;
        var p;
    }
};
var sameName2a = {
    get 0.0 () {
        return '';
    },
    set 0 (n){
        var p1 = n;
        var p1;
    }
};
var sameName3a = {
    get 0x20 () {
        return '';
    },
    set 3.2e1 (n){
        var p2 = n;
        var p2;
    }
};
var sameName4a = {
    get '' () {
        return '';
    },
    set "" (n){
        var p3 = n;
        var p3;
    }
};
var sameName5a = {
    get '\t' () {
        return '';
    },
    set '\t' (n){
        var p4 = n;
        var p4;
    }
};
var sameName6a = {
    get 'a' () {
        return '';
    },
    set a (n){
        var p5 = n;
        var p5;
    }
};
// PropertyName CallSignature{FunctionBody} is equivalent to PropertyName:function CallSignature{FunctionBody}
var callSig1 = {
    num: function num(n1) {
        return '';
    }
};
var callSig1;
var callSig2 = {
    num: function num(n1) {
        return '';
    }
};
var callSig2;
var callSig3 = {
    num: function(n1) {
        return '';
    }
};
var callSig3;
// Get accessor only, type of the property is the annotated return type of the get accessor
var getter1 = {
    get x () {
        return undefined;
    }
};
var getter1;
// Get accessor only, type of the property is the inferred return type of the get accessor
var getter2 = {
    get x () {
        return '';
    }
};
var getter2;
// Set accessor only, type of the property is the param type of the set accessor
var setter1 = {
    set x (n){}
};
var setter1;
// Set accessor only, type of the property is Any for an unannotated set accessor
var setter2 = {
    set x (n){}
};
var setter2;
var anyVar;
// Get and set accessor with matching type annotations
var sameType1 = {
    get x () {
        return undefined;
    },
    set x (n){}
};
var sameType2 = {
    get x () {
        return undefined;
    },
    set x (n){}
};
var sameType3 = {
    get x () {
        return undefined;
    },
    set x (n){}
};
var sameType4 = {
    get x () {
        return undefined;
    },
    set x (n){}
};
// Type of unannotated get accessor return type is the type annotation of the set accessor param
var setParamType1 = {
    set n (x){},
    get n () {
        return function(t) {
            var p;
            var p = t;
        };
    }
};
var setParamType2 = {
    get n () {
        return function(t) {
            var p;
            var p = t;
        };
    },
    set n (x){}
};
// Type of unannotated set accessor parameter is the return type annotation of the get accessor
var getParamType1 = {
    set n (x){
        var y = x;
        var y;
    },
    get n () {
        return '';
    }
};
var getParamType2 = {
    get n () {
        return '';
    },
    set n (x){
        var y1 = x;
        var y1;
    }
};
// Type of unannotated accessors is the inferred return type of the get accessor
var getParamType3 = {
    get n () {
        return '';
    },
    set n (x){
        var y2 = x;
        var y2;
    }
};
