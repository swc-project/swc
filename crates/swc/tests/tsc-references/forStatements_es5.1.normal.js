import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
function F(x) {
    return 42;
}
var M;
(function(M1) {
    var F2 = function F2(x) {
        return x.toString();
    };
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    M1.A = A;
    M1.F2 = F2;
})(M || (M = {}));
for(var aNumber = 9.9;;){}
for(var aString = "this is a string";;){}
for(var aDate = new Date(12);;){}
for(var anObject = new Object();;){}
for(var anAny = null;;){}
for(var aSecondAny = undefined;;){}
for(var aVoid = undefined;;){}
for(var anInterface = new C();;){}
for(var aClass = new C();;){}
for(var aGenericClass = new D();;){}
for(var anObjectLiteral = {
    id: 12
};;){}
for(var anOtherObjectLiteral = new C();;){}
for(var aFunction = F;;){}
for(var anOtherFunction = F;;){}
for(var aLambda = function(x) {
    return 2;
};;){}
for(var aModule = M;;){}
for(var aClassInModule = new M.A();;){}
for(var aFunctionInModule = function(x) {
    return "this is a string";
};;){}
