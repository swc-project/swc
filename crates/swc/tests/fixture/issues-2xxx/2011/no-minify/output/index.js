var __ = new WeakMap(), ClassB;
var ClassA = function ClassA() {
    "use strict";
};
module.exports = (ClassB = /*#__PURE__*/ function() {
    "use strict";
    function ClassB() {}
    var _proto = ClassB.prototype;
    _proto.it = function it() {
        this.bb = new ClassB.MyA();
    };
    return ClassB;
}(), __.set(ClassB, {
    writable: true,
    value: ClassB.MyA = ClassA
}), ClassB);
