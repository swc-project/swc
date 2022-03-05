import * as swcHelpers from "@swc/helpers";
var C1 = // @declaration: true
/*#__PURE__*/ function() {
    "use strict";
    function C1(x) {
        swcHelpers.classCallCheck(this, C1);
    }
    swcHelpers.createClass(C1, [
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
    swcHelpers.classCallCheck(this, C2);
};
var C3 = function C3() {
    "use strict";
    swcHelpers.classCallCheck(this, C3);
};
var C4 = /*#__PURE__*/ function() {
    "use strict";
    function C4() {
        var _this = this;
        swcHelpers.classCallCheck(this, C4);
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
    swcHelpers.createClass(C4, [
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
