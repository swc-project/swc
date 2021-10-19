// Get and set accessor with the same name
var sameName1a = {
    get 'a' () {
        return '';
    },
    set a (n6){
        var p = n6;
        var p;
    }
};
var sameName2a = {
    get 0 () {
        return '';
    },
    set 0 (n1){
        var p = n1;
        var p;
    }
};
var sameName3a = {
    get 32 () {
        return '';
    },
    set 32 (n2){
        var p = n2;
        var p;
    }
};
var sameName4a = {
    get '' () {
        return '';
    },
    set "" (n3){
        var p = n3;
        var p;
    }
};
var sameName5a = {
    get '\t' () {
        return '';
    },
    set '\t' (n4){
        var p = n4;
        var p;
    }
};
var sameName6a = {
    get 'a' () {
        return '';
    },
    set a (n5){
        var p = n5;
        var p;
    }
};
// PropertyName CallSignature{FunctionBody} is equivalent to PropertyName:function CallSignature{FunctionBody}
var callSig1 = {
    num (n) {
        return '';
    }
};
var callSig1;
var callSig2 = {
    num: function(n) {
        return '';
    }
};
var callSig2;
var callSig3 = {
    num: (n)=>''
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
    set x (n7){
    }
};
var setter1;
// Set accessor only, type of the property is Any for an unannotated set accessor
var setter2 = {
    set x (n8){
    }
};
var setter2;
var anyVar;
// Get and set accessor with matching type annotations
var sameType1 = {
    get x () {
        return undefined;
    },
    set x (n9){
    }
};
var sameType2 = {
    get x () {
        return undefined;
    },
    set x (n10){
    }
};
var sameType3 = {
    get x () {
        return undefined;
    },
    set x (n11){
    }
};
var sameType4 = {
    get x () {
        return undefined;
    },
    set x (n12){
    }
};
// Type of unannotated get accessor return type is the type annotation of the set accessor param
var setParamType1 = {
    set n (x){
    },
    get n () {
        return (t)=>{
            var p;
            var p = t;
        };
    }
};
var setParamType2 = {
    get n () {
        return (t)=>{
            var p;
            var p = t;
        };
    },
    set n (x1){
    }
};
// Type of unannotated set accessor parameter is the return type annotation of the get accessor
var getParamType1 = {
    set n (x2){
        var y = x2;
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
    set n (x3){
        var y = x3;
        var y;
    }
};
// Type of unannotated accessors is the inferred return type of the get accessor
var getParamType3 = {
    get n () {
        return '';
    },
    set n (x4){
        var y = x4;
        var y;
    }
};
