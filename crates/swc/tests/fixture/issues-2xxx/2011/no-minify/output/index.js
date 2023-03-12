import _define_property from "@swc/helpers/src/_define_property.mjs";
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
}(), _define_property(_ClassB, "MyA", ClassA), _ClassB);
