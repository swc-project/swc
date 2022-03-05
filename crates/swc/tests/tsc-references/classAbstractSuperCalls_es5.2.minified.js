import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return swcHelpers.createClass(A, [
        {
            key: "foo",
            value: function() {
                return 1;
            }
        }
    ]), A;
}(), B = function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(B, [
        {
            key: "bar",
            value: function() {
                swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "foo", this).call(this);
            }
        },
        {
            key: "baz",
            value: function() {
                return this.foo;
            }
        }
    ]), B;
}(A), C = function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function() {
                return 2;
            }
        },
        {
            key: "qux",
            value: function() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "foo", this).call(this) || swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "foo", this);
            }
        },
        {
            key: "norf",
            value: function() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "bar", this).call(this);
            }
        }
    ]), C;
}(B), AA = function() {
    "use strict";
    function AA() {
        swcHelpers.classCallCheck(this, AA);
    }
    return swcHelpers.createClass(AA, [
        {
            key: "foo",
            value: function() {
                return 1;
            }
        },
        {
            key: "bar",
            value: function() {
                return this.foo();
            }
        }
    ]), AA;
}(), BB = function(AA) {
    "use strict";
    swcHelpers.inherits(BB, AA);
    var _super = swcHelpers.createSuper(BB);
    function BB() {
        return swcHelpers.classCallCheck(this, BB), _super.apply(this, arguments);
    }
    return BB;
}(AA);
