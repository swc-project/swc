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
    ClassB.MyA = ClassA;
    return ClassB;
})();
