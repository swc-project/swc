function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var ClassA = function ClassA() {
    "use strict";
    _classCallCheck(this, ClassA);
};
module.exports = function() {
    var obj, ClassB = function() {
        "use strict";
        var staticProps;
        function ClassB() {
            _classCallCheck(this, ClassB);
        }
        return _defineProperties(ClassB.prototype, [
            {
                key: "it",
                value: function() {
                    this.bb = new ClassB.MyA();
                }
            }
        ]), staticProps && _defineProperties(ClassB, staticProps), ClassB;
    }();
    return "MyA" in (obj = ClassB) ? Object.defineProperty(obj, "MyA", {
        value: ClassA,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj.MyA = ClassA, ClassB;
}();
