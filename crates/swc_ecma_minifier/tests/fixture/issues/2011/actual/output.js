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
    var obj, value, ClassB = function() {
        "use strict";
        var Constructor, staticProps;
        function ClassB() {
            _classCallCheck(this, ClassB);
        }
        return Constructor = ClassB, _defineProperties(Constructor.prototype, [
            {
                key: "it",
                value: function() {
                    this.bb = new ClassB.MyA();
                }
            }, 
        ]), staticProps && _defineProperties(Constructor, staticProps), ClassB;
    }();
    return obj = ClassB, value = ClassA, "MyA" in obj ? Object.defineProperty(obj, "MyA", {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj.MyA = value, ClassB;
}();
