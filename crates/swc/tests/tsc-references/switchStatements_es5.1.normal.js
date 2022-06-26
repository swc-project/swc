import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _type_of from "@swc/helpers/src/_type_of.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var M;
(function(M) {
    var fn = function fn(x) {
        return "";
    };
    M.fn = fn;
})(M || (M = {}));
var x;
switch(x){
    case "":
    case 12:
    case true:
    case null:
    case undefined:
    case new Date(12):
    case new Object():
    case /[a-z]/:
    case []:
    case {}:
    case {
        id: 12
    }:
    case [
        "a"
    ]:
    case typeof x === "undefined" ? "undefined" : _type_of(x):
    case typeof M === "undefined" ? "undefined" : _type_of(M):
    case M.fn(1):
    case function(x) {
        return "";
    }:
    case function(x) {
        return "";
    }(2):
    default:
}
// basic assignable check, rest covered in tests for 'assignment compatibility'
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
switch(new C()){
    case new D():
    case {
        id: 12,
        name: ""
    }:
    case new C():
}
switch(""){
}
switch(12){
}
switch(true){
}
switch(null){
}
switch(undefined){
}
switch(new Date(12)){
}
switch(new Object()){
}
switch(/[a-z]/){
}
switch([]){
}
switch({}){
}
switch({
    id: 12
}){
}
switch([
    "a"
]){
}
switch(function(x) {
    return "";
}){
}
switch(function(x) {
    return "";
}(1)){
}
