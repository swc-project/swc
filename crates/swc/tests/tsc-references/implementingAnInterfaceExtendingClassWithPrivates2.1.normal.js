//// [implementingAnInterfaceExtendingClassWithPrivates2.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar, Foo);
    function Bar() {
        _class_call_check(this, Bar);
        return _call_super(this, Bar, arguments);
    }
    return Bar;
}(Foo);
var Bar2 = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar2, Foo);
    function Bar2() {
        _class_call_check(this, Bar2);
        return _call_super(this, Bar2, arguments);
    }
    return Bar2;
}(Foo);
var Bar3 = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar3, Foo);
    function Bar3() {
        _class_call_check(this, Bar3);
        return _call_super(this, Bar3, arguments);
    }
    return Bar3;
}(Foo);
// another level of indirection
(function(M) {
    var Foo = function Foo() {
        "use strict";
        _class_call_check(this, Foo);
    };
    var Baz = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Baz, Foo);
        function Baz() {
            _class_call_check(this, Baz);
            return _call_super(this, Baz, arguments);
        }
        return Baz;
    }(Foo);
    var Bar = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar, Foo);
        function Bar() {
            _class_call_check(this, Bar);
            return _call_super(this, Bar, arguments);
        }
        return Bar;
    }(Foo);
    var Bar2 = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar2, Foo);
        function Bar2() {
            _class_call_check(this, Bar2);
            return _call_super(this, Bar2, arguments);
        }
        return Bar2;
    }(Foo);
    var Bar3 = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar3, Foo);
        function Bar3() {
            _class_call_check(this, Bar3);
            return _call_super(this, Bar3, arguments);
        }
        return Bar3;
    }(Foo);
})(M || (M = {}));
// two levels of privates
(function(M2) {
    var Foo = function Foo() {
        "use strict";
        _class_call_check(this, Foo);
    };
    var Baz = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Baz, Foo);
        function Baz() {
            _class_call_check(this, Baz);
            return _call_super(this, Baz, arguments);
        }
        return Baz;
    }(Foo);
    var Bar = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar, Foo);
        function Bar() {
            _class_call_check(this, Bar);
            return _call_super(this, Bar, arguments);
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
        function Bar2() {
            _class_call_check(this, Bar2);
            return _call_super(this, Bar2, arguments);
        }
        return Bar2;
    }(Foo);
    var Bar3 = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar3, Foo);
        function Bar3() {
            _class_call_check(this, Bar3);
            return _call_super(this, Bar3, arguments);
        }
        return Bar3;
    }(Foo);
})(M2 || (M2 = {}));
var M, M2;
