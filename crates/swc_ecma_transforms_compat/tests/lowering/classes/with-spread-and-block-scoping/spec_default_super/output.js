var Test = /*#__PURE__*/ function() {
    "use strict";
    function Test() {
        _class_call_check(this, Test);
        return _get(_get_prototype_of(Test.prototype), "constructor", this);
    }
    _create_class(Test, null, [
        {
            key: "test",
            value: function test() {
                return _get(_get_prototype_of(Test), "constructor", this);
            }
        }
    ]);
    return Test;
}();
// Instances
expect(Object.getPrototypeOf(Test.prototype)).toBe(Object.prototype);
expect(new Test()).toBe(Object);
// Static
expect(Object.getPrototypeOf(Test)).toBe(Function.prototype);
expect(Test.test()).toBe(Function);
