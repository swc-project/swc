import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar, Foo);
    var _super = _create_super(Bar);
    function Bar() {
        _class_call_check(this, Bar);
        return _super.apply(this, arguments);
    }
    return Bar;
}(Foo);
var Bar2 = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar2, Foo);
    var _super = _create_super(Bar2);
    function Bar2() {
        _class_call_check(this, Bar2);
        return _super.apply(this, arguments);
    }
    return Bar2;
}(Foo);
var Bar3 = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar3, Foo);
    var _super = _create_super(Bar3);
    function Bar3() {
        _class_call_check(this, Bar3);
        return _super.apply(this, arguments);
    }
    return Bar3;
}(Foo);
// another level of indirection
var M;
(function(M) {
    var Foo = function Foo() {
        "use strict";
        _class_call_check(this, Foo);
    };
    var Baz = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Baz, Foo);
        var _super = _create_super(Baz);
        function Baz() {
            _class_call_check(this, Baz);
            return _super.apply(this, arguments);
        }
        return Baz;
    }(Foo);
    var Bar = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar, Foo);
        var _super = _create_super(Bar);
        function Bar() {
            _class_call_check(this, Bar);
            return _super.apply(this, arguments);
        }
        return Bar;
    }(Foo);
    var Bar2 = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar2, Foo);
        var _super = _create_super(Bar2);
        function Bar2() {
            _class_call_check(this, Bar2);
            return _super.apply(this, arguments);
        }
        return Bar2;
    }(Foo);
    var Bar3 = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar3, Foo);
        var _super = _create_super(Bar3);
        function Bar3() {
            _class_call_check(this, Bar3);
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
        _class_call_check(this, Foo);
    };
    var Baz = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Baz, Foo);
        var _super = _create_super(Baz);
        function Baz() {
            _class_call_check(this, Baz);
            return _super.apply(this, arguments);
        }
        return Baz;
    }(Foo);
    var Bar = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar, Foo);
        var _super = _create_super(Bar);
        function Bar() {
            _class_call_check(this, Bar);
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
        _inherits(Bar2, Foo);
        var _super = _create_super(Bar2);
        function Bar2() {
            _class_call_check(this, Bar2);
            return _super.apply(this, arguments);
        }
        return Bar2;
    }(Foo);
    var Bar3 = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar3, Foo);
        var _super = _create_super(Bar3);
        function Bar3() {
            _class_call_check(this, Bar3);
            return _super.apply(this, arguments);
        }
        return Bar3;
    }(Foo);
})(M2 || (M2 = {}));
