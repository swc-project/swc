function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var ClassA = function ClassA1() {
    "use strict";
    _classCallCheck(this, ClassA1);
};
module.exports = function() {
    var obj, key, value, ClassB1 = function() {
        "use strict";
        var Constructor, protoProps, staticProps;
        function ClassB() {
            _classCallCheck(this, ClassB);
        }
        return Constructor = ClassB, protoProps = [
            {
                key: "it",
                value: function() {
                    this.bb = new ClassB.MyA();
                }
            }
        ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), ClassB;
    }();
    return obj = ClassB1, key = "MyA", value = ClassA, key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, ClassB1;
}();
