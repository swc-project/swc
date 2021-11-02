function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
// @allowUnreachableCode: true
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
for(var i1 = 0;;){
    throw i1;
}
for(var idx in {
}){
    throw idx;
}
do {
    throw null;
}while (true)
var j = 0;
while(j < 0){
    throw j;
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
        throw this;
    }
    _createClass(C, [
        {
            key: "biz",
            value: function biz() {
                throw this.value;
            }
        }
    ]);
    return C;
}();
var aa = {
    id: 12,
    biz: function() {
        throw this;
    }
};
