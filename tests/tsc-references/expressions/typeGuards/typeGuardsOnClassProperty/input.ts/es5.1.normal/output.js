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
var D = // Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
// Note that the class's property must be copied to a local variable for
// the type guard to have an effect
/*#__PURE__*/ function() {
    "use strict";
    function D() {
        _classCallCheck(this, D);
    }
    _createClass(D, [
        {
            key: "getData",
            value: function getData() {
                var data = this.data;
                return typeof data === "string" ? data : data.join(" ");
            }
        },
        {
            key: "getData1",
            value: function getData1() {
                return typeof this.data === "string" ? this.data : this.data.join(" ");
            }
        }
    ]);
    return D;
}();
var o = {
    prop1: "string",
    prop2: true
};
if (typeof o.prop1 === "string" && o.prop1.toLowerCase()) {
}
var prop1 = o.prop1;
if (typeof prop1 === "string" && prop1.toLocaleLowerCase()) {
}
