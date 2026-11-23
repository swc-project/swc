function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw TypeError("Cannot call a class as a function");
}
var ClassB, ClassA = function ClassA() {
    "use strict";
    _classCallCheck(this, ClassA);
};
module.exports = ("MyA" in (ClassB = /*#__PURE__*/ function() {
    "use strict";
    var protoProps;
    function ClassB() {
        _classCallCheck(this, ClassB);
    }
    return protoProps = [
        {
            key: "it",
            value: function() {
                this.bb = new ClassB.MyA();
            }
        }
    ], function(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    }(ClassB.prototype, protoProps), ClassB;
}()) ? Object.defineProperty(ClassB, "MyA", {
    value: ClassA,
    enumerable: !0,
    configurable: !0,
    writable: !0
}) : ClassB.MyA = ClassA, ClassB);
