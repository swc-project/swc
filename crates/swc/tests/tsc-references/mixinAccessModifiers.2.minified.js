//// [mixinAccessModifiers.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Private = function Private() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _class_call_check(this, Private);
}, Protected = function Protected() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _class_call_check(this, Protected);
}, Public = function Public() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _class_call_check(this, Public);
};
Mix(Private, function Private2() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _class_call_check(this, Private2);
}), Mix(Private, Protected), Mix(Private, Public);
var C4 = function(_Mix) {
    _inherits(C4, _Mix);
    var _super = _create_super(C4);
    function C4() {
        return _class_call_check(this, C4), _super.apply(this, arguments);
    }
    return C4.prototype.f = function(c4, c5, c6) {
        c4.p, c5.p, c6.p;
    }, C4.g = function() {
        C4.s, C5.s, C6.s;
    }, C4;
}(Mix(Protected, function Protected2() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _class_call_check(this, Protected2);
})), C5 = function(_Mix) {
    _inherits(C5, _Mix);
    var _super = _create_super(C5);
    function C5() {
        return _class_call_check(this, C5), _super.apply(this, arguments);
    }
    return C5.prototype.f = function(c4, c5, c6) {
        c4.p, c5.p, c6.p;
    }, C5.g = function() {
        C4.s, C5.s, C6.s;
    }, C5;
}(Mix(Protected, Public)), C6 = function(_Mix) {
    _inherits(C6, _Mix);
    var _super = _create_super(C6);
    function C6() {
        return _class_call_check(this, C6), _super.apply(this, arguments);
    }
    return C6.prototype.f = function(c4, c5, c6) {
        c4.p, c5.p, c6.p;
    }, C6.g = function() {
        C4.s, C5.s, C6.s;
    }, C6;
}(Mix(Public, function Public2() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _class_call_check(this, Public2);
}));
