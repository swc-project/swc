function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @target: esnext, es2022, es2015, es5
function foo() {
    var _class1, __1;
    return _class1 = function _class() {
        "use strict";
        _classCallCheck(this, _class);
    }, _class1.foo = 1, __1 = {
        writable: true,
        value: (function() {
            var _class2, __;
            var c = (_class2 = function _class() {
                "use strict";
                _classCallCheck(this, _class);
            }, _class2.bar = 2, __ = {
                writable: true,
                value: function() {
                // do
                }()
            }, _class2);
        })()
    }, _class1;
}
