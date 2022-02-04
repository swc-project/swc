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
//@target: es5
// Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
var num;
var strOrNum;
var C1 = /*#__PURE__*/ function() {
    "use strict";
    function C1() {
        _classCallCheck(this, C1);
    }
    _createClass(C1, [
        {
            key: "pp3",
            get: // Inside public accessor getter
            function get() {
                return strOrNum;
            }
        },
        {
            key: "method",
            value: function method() {
                strOrNum = typeof this.pp1 === "string" && this.pp1; // string | number
                strOrNum = typeof this.pp2 === "string" && this.pp2; // string | number
                strOrNum = typeof this.pp3 === "string" && this.pp3; // string | number
            }
        }
    ]);
    return C1;
}();
var c1;
strOrNum = typeof c1.pp2 === "string" && c1.pp2; // string | number
strOrNum = typeof c1.pp3 === "string" && c1.pp3; // string | number
var obj1;
strOrNum = typeof obj1.x === "string" && obj1.x; // string | number
