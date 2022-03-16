import * as swcHelpers from "@swc/helpers";
var Private = function() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    swcHelpers.classCallCheck(this, Private);
}, Private2 = function() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    swcHelpers.classCallCheck(this, Private2);
}, Protected = function() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    swcHelpers.classCallCheck(this, Protected);
}, Protected2 = function() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    swcHelpers.classCallCheck(this, Protected2);
}, Public = function() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    swcHelpers.classCallCheck(this, Public);
}, Public2 = function() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    swcHelpers.classCallCheck(this, Public2);
}, C1 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(C1, _superClass);
    var _super = swcHelpers.createSuper(C1);
    function C1() {
        return swcHelpers.classCallCheck(this, C1), _super.apply(this, arguments);
    }
    return C1;
}(Mix(Private, Private2)), C2 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(C2, _superClass);
    var _super = swcHelpers.createSuper(C2);
    function C2() {
        return swcHelpers.classCallCheck(this, C2), _super.apply(this, arguments);
    }
    return C2;
}(Mix(Private, Protected)), C3 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(C3, _superClass);
    var _super = swcHelpers.createSuper(C3);
    function C3() {
        return swcHelpers.classCallCheck(this, C3), _super.apply(this, arguments);
    }
    return C3;
}(Mix(Private, Public)), C4 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(C4, _superClass);
    var _super = swcHelpers.createSuper(C4);
    function C4() {
        return swcHelpers.classCallCheck(this, C4), _super.apply(this, arguments);
    }
    return C4.prototype.f = function(c4, c5, c6) {
        c4.p, c5.p, c6.p;
    }, C4.g = function() {
        C4.s, C5.s, C6.s;
    }, C4;
}(Mix(Protected, Protected2)), C5 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(C5, _superClass);
    var _super = swcHelpers.createSuper(C5);
    function C5() {
        return swcHelpers.classCallCheck(this, C5), _super.apply(this, arguments);
    }
    return C5.prototype.f = function(c4, c5, c6) {
        c4.p, c5.p, c6.p;
    }, C5.g = function() {
        C4.s, C5.s, C6.s;
    }, C5;
}(Mix(Protected, Public)), C6 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(C6, _superClass);
    var _super = swcHelpers.createSuper(C6);
    function C6() {
        return swcHelpers.classCallCheck(this, C6), _super.apply(this, arguments);
    }
    return C6.prototype.f = function(c4, c5, c6) {
        c4.p, c5.p, c6.p;
    }, C6.g = function() {
        C4.s, C5.s, C6.s;
    }, C6;
}(Mix(Public, Public2)), ProtectedGeneric = function() {
    "use strict";
    function ProtectedGeneric() {
        swcHelpers.classCallCheck(this, ProtectedGeneric);
    }
    var _proto = ProtectedGeneric.prototype;
    return _proto.privateMethod = function() {}, _proto.protectedMethod = function() {}, ProtectedGeneric;
}(), ProtectedGeneric2 = function() {
    "use strict";
    function ProtectedGeneric2() {
        swcHelpers.classCallCheck(this, ProtectedGeneric2);
    }
    var _proto = ProtectedGeneric2.prototype;
    return _proto.privateMethod = function() {}, _proto.protectedMethod = function() {}, ProtectedGeneric2;
}();
