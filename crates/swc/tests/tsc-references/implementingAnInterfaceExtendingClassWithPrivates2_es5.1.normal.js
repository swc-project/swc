import * as swcHelpers from "@swc/helpers";
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    swcHelpers.inherits(Bar, Foo);
    var _super = swcHelpers.createSuper(Bar);
    function Bar() {
        swcHelpers.classCallCheck(this, Bar);
        return _super.apply(this, arguments);
    }
    return Bar;
}(Foo);
var Bar2 = /*#__PURE__*/ function(Foo) {
    "use strict";
    swcHelpers.inherits(Bar2, Foo);
    var _super = swcHelpers.createSuper(Bar2);
    function Bar2() {
        swcHelpers.classCallCheck(this, Bar2);
        return _super.apply(this, arguments);
    }
    return Bar2;
}(Foo);
var Bar3 = /*#__PURE__*/ function(Foo) {
    "use strict";
    swcHelpers.inherits(Bar3, Foo);
    var _super = swcHelpers.createSuper(Bar3);
    function Bar3() {
        swcHelpers.classCallCheck(this, Bar3);
        return _super.apply(this, arguments);
    }
    return Bar3;
}(Foo);
// another level of indirection
var M;
(function(M) {
    var Foo = function Foo() {
        "use strict";
        swcHelpers.classCallCheck(this, Foo);
    };
    var Baz = /*#__PURE__*/ function(Foo) {
        "use strict";
        swcHelpers.inherits(Baz, Foo);
        var _super = swcHelpers.createSuper(Baz);
        function Baz() {
            swcHelpers.classCallCheck(this, Baz);
            return _super.apply(this, arguments);
        }
        return Baz;
    }(Foo);
    var Bar = /*#__PURE__*/ function(Foo) {
        "use strict";
        swcHelpers.inherits(Bar, Foo);
        var _super = swcHelpers.createSuper(Bar);
        function Bar() {
            swcHelpers.classCallCheck(this, Bar);
            return _super.apply(this, arguments);
        }
        return Bar;
    }(Foo);
    var Bar2 = /*#__PURE__*/ function(Foo) {
        "use strict";
        swcHelpers.inherits(Bar2, Foo);
        var _super = swcHelpers.createSuper(Bar2);
        function Bar2() {
            swcHelpers.classCallCheck(this, Bar2);
            return _super.apply(this, arguments);
        }
        return Bar2;
    }(Foo);
    var Bar3 = /*#__PURE__*/ function(Foo) {
        "use strict";
        swcHelpers.inherits(Bar3, Foo);
        var _super = swcHelpers.createSuper(Bar3);
        function Bar3() {
            swcHelpers.classCallCheck(this, Bar3);
            return _super.apply(this, arguments);
        }
        return Bar3;
    }(Foo);
})(M || (M = {}));
// two levels of privates
var M2;
(function(M2) {
    var Foo = function Foo() {
        "use strict";
        swcHelpers.classCallCheck(this, Foo);
    };
    var Baz = /*#__PURE__*/ function(Foo) {
        "use strict";
        swcHelpers.inherits(Baz, Foo);
        var _super = swcHelpers.createSuper(Baz);
        function Baz() {
            swcHelpers.classCallCheck(this, Baz);
            return _super.apply(this, arguments);
        }
        return Baz;
    }(Foo);
    var Bar = /*#__PURE__*/ function(Foo) {
        "use strict";
        swcHelpers.inherits(Bar, Foo);
        var _super = swcHelpers.createSuper(Bar);
        function Bar() {
            swcHelpers.classCallCheck(this, Bar);
            return _super.apply(this, arguments);
        }
        return Bar;
    }(Foo);
    var b;
    var r1 = b.z;
    var r2 = b.x; // error
    var r3 = b.y; // error
    var Bar2 = /*#__PURE__*/ function(Foo) {
        "use strict";
        swcHelpers.inherits(Bar2, Foo);
        var _super = swcHelpers.createSuper(Bar2);
        function Bar2() {
            swcHelpers.classCallCheck(this, Bar2);
            return _super.apply(this, arguments);
        }
        return Bar2;
    }(Foo);
    var Bar3 = /*#__PURE__*/ function(Foo) {
        "use strict";
        swcHelpers.inherits(Bar3, Foo);
        var _super = swcHelpers.createSuper(Bar3);
        function Bar3() {
            swcHelpers.classCallCheck(this, Bar3);
            return _super.apply(this, arguments);
        }
        return Bar3;
    }(Foo);
})(M2 || (M2 = {}));
