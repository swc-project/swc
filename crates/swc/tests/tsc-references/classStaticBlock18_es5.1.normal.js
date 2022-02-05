function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _class, _class1;
// @target: esnext, es2022, es2015, es5
function foo() {
    return _class1 = (function() {
        var _class2 = function _class2() {
            "use strict";
            _classCallCheck(this, _class2);
        };
        var __ = {
            writable: true,
            value: function() {
                var c = (_class = function() {
                    var _class3 = function _class3() {
                        "use strict";
                        _classCallCheck(this, _class3);
                    };
                    var __ = {
                        writable: true,
                        value: function() {
                        // do
                        }()
                    };
                    return _class3;
                }(), _class.bar = 2, _class);
            }()
        };
        return _class2;
    })(), _class1.foo = 1, _class1;
}
