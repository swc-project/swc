import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
        this.self = this;
        this.c = new C();
    }
    swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function foo() {
                return this;
            }
        },
        {
            key: "f1",
            value: function f1() {
                this.c = this.self;
                this.self = this.c; // Error
            }
        },
        {
            key: "f2",
            value: function f2() {
                var a;
                var a = [
                    this,
                    this.c
                ]; // C[] since this is subtype of C
                var b;
                var b = [
                    this,
                    this.self,
                    null,
                    undefined
                ];
            }
        },
        {
            key: "f3",
            value: function f3(b) {
                return b ? this.c : this.self; // Should be C
            }
        }
    ]);
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        var _this;
        _this = _super.apply(this, arguments);
        _this.self1 = swcHelpers.assertThisInitialized(_this);
        _this.self2 = _this.self;
        _this.self3 = _this.foo();
        _this.d = new D();
        return _this;
    }
    swcHelpers.createClass(D, [
        {
            key: "bar",
            value: function bar() {
                this.self = this.self1;
                this.self = this.self2;
                this.self = this.self3;
                this.self1 = this.self;
                this.self2 = this.self;
                this.self3 = this.self;
                this.d = this.self;
                this.d = this.c; // Error
                this.self = this.d; // Error
                this.c = this.d;
            }
        }
    ]);
    return D;
}(C);
