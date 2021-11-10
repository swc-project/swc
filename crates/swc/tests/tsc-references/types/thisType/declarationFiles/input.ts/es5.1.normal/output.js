function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var C1 = // @declaration: true
/*#__PURE__*/ function() {
    "use strict";
    function C1(x) {
        _classCallCheck(this, C1);
    }
    _createClass(C1, [
        {
            key: "f",
            value: function f(x) {
                return undefined;
            }
        }
    ]);
    return C1;
}();
var C2 = function C2() {
    "use strict";
    _classCallCheck(this, C2);
};
var C3 = function C3() {
    "use strict";
    _classCallCheck(this, C3);
};
var C4 = /*#__PURE__*/ function() {
    "use strict";
    function C4() {
        var _this = this;
        _classCallCheck(this, C4);
        this.x1 = {
            a: this
        };
        this.x2 = [
            this
        ];
        this.x3 = [
            {
                a: this
            }
        ];
        this.x4 = function() {
            return _this;
        };
    }
    _createClass(C4, [
        {
            key: "f1",
            value: function f1() {
                return {
                    a: this
                };
            }
        },
        {
            key: "f2",
            value: function f2() {
                return [
                    this
                ];
            }
        },
        {
            key: "f3",
            value: function f3() {
                return [
                    {
                        a: this
                    }
                ];
            }
        },
        {
            key: "f4",
            value: function f4() {
                var _this = this;
                return function() {
                    return _this;
                };
            }
        }
    ]);
    return C4;
}();
