import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @allowUnreachableCode: true
var ANY;
var BOOLEAN;
var NUMBER;
var STRING;
var OBJECT;
var CLASS = function CLASS() {
    "use strict";
    _class_call_check(this, CLASS);
};
//The second operand type is Object
ANY, OBJECT;
BOOLEAN, OBJECT;
NUMBER, OBJECT;
STRING, OBJECT;
OBJECT, OBJECT;
//Return type is Object
var resultIsObject1 = (ANY, OBJECT);
var resultIsObject2 = (BOOLEAN, OBJECT);
var resultIsObject3 = (NUMBER, OBJECT);
var resultIsObject4 = (STRING, OBJECT);
var resultIsObject5 = (OBJECT, OBJECT);
//Literal and expression
null, OBJECT;
ANY = null, OBJECT;
true, {};
!BOOLEAN, [];
"string", new Date();
STRING.toLowerCase(), new CLASS();
var resultIsObject6 = (null, OBJECT);
var resultIsObject7 = (ANY = null, OBJECT);
var resultIsObject8 = (true, {});
var resultIsObject9 = (!BOOLEAN, {
    a: 1,
    b: "s"
});
var resultIsObject10 = ("string", new Date());
var resultIsObject11 = (STRING.toLowerCase(), new CLASS());
