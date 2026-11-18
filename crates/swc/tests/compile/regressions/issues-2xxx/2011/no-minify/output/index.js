var _ClassB;
var ClassA = function ClassA() {
    "use strict";
};
module.exports = (_ClassB = /*#__PURE__*/ function() {
    "use strict";
    function ClassB() {}
    var _proto = ClassB.prototype;
    _proto.it = function it() {
        this.bb = new ClassB.MyA();
    };
    return ClassB;
}(), _ClassB.MyA = ClassA, _ClassB);
