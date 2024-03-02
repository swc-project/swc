var Test = /*#__PURE__*/ function() {
    "use strict";
    function Test() {
        _class_call_check(this, Test);
    }
    _create_class(Test, [
        {
            key: "test",
            get: function() {
                return 5 + 5;
            },
            set: function(val) {
                this._test = val;
            }
        }
    ]);
    return Test;
}();
