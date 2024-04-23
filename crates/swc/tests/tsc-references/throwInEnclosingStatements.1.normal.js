//// [throwInEnclosingStatements.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function fn(x) {
    throw x;
}
(function(x) {
    throw x;
});
var y;
switch(y){
    case 'a':
        throw y;
    default:
        throw y;
}
var z = 0;
while(z < 10){
    throw z;
}
for(var i = 0;;){
    throw i;
}
for(var idx in {}){
    throw idx;
}
do {
    throw null;
}while (true);
var j = 0;
while(j < 0){
    throw j;
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        throw this;
    }
    var _proto = C.prototype;
    _proto.biz = function biz() {
        throw this.value;
    };
    return C;
}();
var aa = {
    id: 12,
    biz: function biz() {
        throw this;
    }
};
