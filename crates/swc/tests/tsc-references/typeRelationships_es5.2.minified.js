import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C), this.self = this, this.c = new C();
    }
    return swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function() {
                return this;
            }
        },
        {
            key: "f1",
            value: function() {
                this.c = this.self, this.self = this.c;
            }
        },
        {
            key: "f2",
            value: function() {
                this.c, this.self;
            }
        },
        {
            key: "f3",
            value: function(b) {
                return b ? this.c : this.self;
            }
        }
    ]), C;
}(), D = function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        var _this;
        return swcHelpers.classCallCheck(this, D), _this = _super.apply(this, arguments), _this.self1 = swcHelpers.assertThisInitialized(_this), _this.self2 = _this.self, _this.self3 = _this.foo(), _this.d = new D(), _this;
    }
    return swcHelpers.createClass(D, [
        {
            key: "bar",
            value: function() {
                this.self = this.self1, this.self = this.self2, this.self = this.self3, this.self1 = this.self, this.self2 = this.self, this.self3 = this.self, this.d = this.self, this.d = this.c, this.self = this.d, this.c = this.d;
            }
        }
    ]), D;
}(C);
