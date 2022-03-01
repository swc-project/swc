function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _class, _class1;
// @target: esnext, es2022, es2015, es5
function foo() {
    var _class2, __1;
    return _class1 = (_class2 = function _class3() {
        "use strict";
        _classCallCheck(this, _class3);
    }, __1 = {
        writable: true,
        value: (function() {
            var _class4, __;
            var c = (_class = (_class4 = function _class3() {
                "use strict";
                _classCallCheck(this, _class3);
            }, __ = {
                writable: true,
                value: function() {
                // do
                }()
            }, _class4), _class.bar = 2, _class);
        })()
    }, _class2), _class1.foo = 1, _class1;
}
