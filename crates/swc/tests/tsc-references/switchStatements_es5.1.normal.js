import * as swcHelpers from "@swc/helpers";
var M;
(function(M1) {
    var fn = function fn(x) {
        return '';
    };
    M1.fn = fn;
})(M || (M = {}));
var x;
switch(x){
    case '':
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
        'a'
    ]:
    case typeof x === "undefined" ? "undefined" : swcHelpers.typeOf(x):
    case typeof M === "undefined" ? "undefined" : swcHelpers.typeOf(M):
    case M.fn(1):
    case function(x) {
        return '';
    }:
    case function(x) {
        return '';
    }(2):
    default:
}
// basic assignable check, rest covered in tests for 'assignment compatibility'
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var D = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
switch(new C()){
    case new D():
    case {
        id: 12,
        name: ''
    }:
    case new C():
}
switch(''){
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
    'a'
]){
}
switch(function(x) {
    return '';
}){
}
switch(function(x) {
    return '';
}(1)){
}
