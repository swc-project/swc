function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
var ClassA = function ClassA() {
    "use strict";
    _classCallCheck(this, ClassA);
};
module.exports = (function() {
    var ClassB = function() {
        "use strict";
        function ClassB() {
            _classCallCheck(this, ClassB);
        }
        return _createClass(ClassB, [
            {
                key: "it",
                value: function() {
                    this.bb = new ClassB.MyA();
                }
            }
        ]), ClassB;
    }();
    return _defineProperty(ClassB, "MyA", ClassA), ClassB;
})();
