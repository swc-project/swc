//// [mixinAccessModifiers.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Private = function Private() {
    "use strict";
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _class_call_check(this, Private);
}, Private2 = function Private2() {
    "use strict";
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _class_call_check(this, Private2);
}, Protected = function Protected() {
    "use strict";
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _class_call_check(this, Protected);
}, Protected2 = function Protected2() {
    "use strict";
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _class_call_check(this, Protected2);
}, Public = function Public() {
    "use strict";
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _class_call_check(this, Public);
}, Public2 = function Public2() {
    "use strict";
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _class_call_check(this, Public2);
};
Mix(Private, Private2), Mix(Private, Protected), Mix(Private, Public);
var C4 = function(_superClass) {
    "use strict";
    _inherits(C4, _superClass);
    var _super = _create_super(C4);
    function C4() {
        return _class_call_check(this, C4), _super.apply(this, arguments);
    }
    return C4.prototype.f = function(c4, c5, c6) {
        c4.p, c5.p, c6.p;
    }, C4.g = function() {
        C4.s, C5.s, C6.s;
    }, C4;
}(Mix(Protected, Protected2)), C5 = function(_superClass) {
    "use strict";
    _inherits(C5, _superClass);
    var _super = _create_super(C5);
    function C5() {
        return _class_call_check(this, C5), _super.apply(this, arguments);
    }
    return C5.prototype.f = function(c4, c5, c6) {
        c4.p, c5.p, c6.p;
    }, C5.g = function() {
        C4.s, C5.s, C6.s;
    }, C5;
}(Mix(Protected, Public)), C6 = function(_superClass) {
    "use strict";
    _inherits(C6, _superClass);
    var _super = _create_super(C6);
    function C6() {
        return _class_call_check(this, C6), _super.apply(this, arguments);
    }
    return C6.prototype.f = function(c4, c5, c6) {
        c4.p, c5.p, c6.p;
    }, C6.g = function() {
        C4.s, C5.s, C6.s;
    }, C6;
}(Mix(Public, Public2));
