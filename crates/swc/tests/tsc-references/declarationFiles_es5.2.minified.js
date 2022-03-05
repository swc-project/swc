import * as swcHelpers from "@swc/helpers";
var C1 = function() {
    "use strict";
    function C1(x) {
        swcHelpers.classCallCheck(this, C1);
    }
    return swcHelpers.createClass(C1, [
        {
            key: "f",
            value: function(x) {}
        }
    ]), C1;
}(), C2 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C2);
}, C3 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C3);
}, C4 = function() {
    "use strict";
    function C4() {
        var _this = this;
        swcHelpers.classCallCheck(this, C4), this.x1 = {
            a: this
        }, this.x2 = [
            this
        ], this.x3 = [
            {
                a: this
            }
        ], this.x4 = function() {
            return _this;
        };
    }
    return swcHelpers.createClass(C4, [
        {
            key: "f1",
            value: function() {
                return {
                    a: this
                };
            }
        },
        {
            key: "f2",
            value: function() {
                return [
                    this
                ];
            }
        },
        {
            key: "f3",
            value: function() {
                return [
                    {
                        a: this
                    }
                ];
            }
        },
        {
            key: "f4",
            value: function() {
                var _this = this;
                return function() {
                    return _this;
                };
            }
        }
    ]), C4;
}();
