//// [keyofAndIndexedAccess.ts]
var Flag, Flag1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
one(function() {}) // inferred as {}, expected
, on({
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
}(// Repro from #13787
function SampleClass(props) {
    _class_call_check(this, SampleClass), this.props = Object.freeze(props);
}))({}), (Flag1 = Flag || (Flag = {})).FLAG_1 = "flag_1", Flag1.FLAG_2 = "flag_2";
