let Test = /*#__PURE__*/ function() {
    "use strict";
    function Test() {
        _class_call_check(this, Test);
        Object.prototype.hasOwnProperty.call(this, "test");
        return Object.prototype.constructor;
    }
    _create_class(Test, null, [
        {
            key: "test",
            value: function test() {
                return Function.prototype.constructor;
            }
        }
    ]);
    return Test;
}();
