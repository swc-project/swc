//// [keyofAndIndexedAccess.ts]
var E, Flag;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(Shape) {
    "use strict";
    _inherits(TaggedShape, Shape);
    var _super = _create_super(TaggedShape);
    function TaggedShape() {
        return _class_call_check(this, TaggedShape), _super.apply(this, arguments);
    }
    return TaggedShape;
}(function Shape() {
    "use strict";
    _class_call_check(this, Shape);
}), function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
}(E || (E = {})), one(function() {}), on({
    test: function() {}
}), on({
    test: function(x) {}
}), new Component1({
    data: {
        hello: ""
    }
}).get("hello"), dispatchMethod("someMethod", [
    "hello",
    35
]), new (function(SampleClass) {
    "use strict";
    _inherits(AnotherSampleClass, SampleClass);
    var _super = _create_super(AnotherSampleClass);
    function AnotherSampleClass(props) {
        return _class_call_check(this, AnotherSampleClass), _super.call(this, merge(props, {
            foo: "bar"
        }));
    }
    return AnotherSampleClass.prototype.brokenMethod = function() {
        this.props.foo.concat;
    }, AnotherSampleClass;
}(function SampleClass(props) {
    "use strict";
    _class_call_check(this, SampleClass), this.props = Object.freeze(props);
}))({}), function(Flag) {
    Flag.FLAG_1 = "flag_1", Flag.FLAG_2 = "flag_2";
}(Flag || (Flag = {}));
