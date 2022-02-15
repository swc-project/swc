function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
var ClassA = function ClassA() {
    "use strict";
};
module.exports = (function() {
    var ClassB = /*#__PURE__*/ function() {
        "use strict";
        function ClassB() {}
        var _proto = ClassB.prototype;
        _proto.it = function it() {
            this.bb = new ClassB.MyA();
        };
        return ClassB;
    }();
    _defineProperty(ClassB, "MyA", ClassA);
    return ClassB;
})();
