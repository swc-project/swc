function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var C = // @target: es2015
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
        var _this_test, _this_test1, _this_test2, _this_test3, _this_test4;
        _classPrivateFieldInit(this, _test, {
            writable: true,
            value: 24
        });
        _classPrivateFieldSet(this, _test, (_this_test = +_classPrivateFieldGet(this, _test)) + 1), _this_test;
        _classPrivateFieldSet(this, _test, (_this_test1 = +_classPrivateFieldGet(this, _test)) - 1), _this_test1;
        _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) + 1);
        _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) - 1);
        var a = (_classPrivateFieldSet(this, _test, (_this_test2 = +_classPrivateFieldGet(this, _test)) + 1), _this_test2);
        var b = (_classPrivateFieldSet(this, _test, (_this_test3 = +_classPrivateFieldGet(this, _test)) - 1), _this_test3);
        var c = _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) + 1);
        var d = _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) - 1);
        for(_classPrivateFieldSet(this, _test, 0); _classPrivateFieldGet(this, _test) < 10; _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) + 1)){}
        for(_classPrivateFieldSet(this, _test, 0); _classPrivateFieldGet(this, _test) < 10; _classPrivateFieldSet(this, _test, (_this_test4 = +_classPrivateFieldGet(this, _test)) + 1), _this_test4){}
    }
    _createClass(C, [
        {
            key: "test",
            value: function test() {
                var _ref, _this_test, _ref1, _this_test5, _ref2, _ref3, _ref4, _this_test6, _ref5, _this_test7, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11, _this_test8;
                _classPrivateFieldSet(_ref = this.getInstance(), _test, (_this_test = +_classPrivateFieldGet(_ref, _test)) + 1), _this_test;
                _classPrivateFieldSet(_ref1 = this.getInstance(), _test, (_this_test5 = +_classPrivateFieldGet(_ref1, _test)) - 1), _this_test5;
                _classPrivateFieldSet(_ref2 = this.getInstance(), _test, +_classPrivateFieldGet(_ref2, _test) + 1);
                _classPrivateFieldSet(_ref3 = this.getInstance(), _test, +_classPrivateFieldGet(_ref3, _test) - 1);
                var a = (_classPrivateFieldSet(_ref4 = this.getInstance(), _test, (_this_test6 = +_classPrivateFieldGet(_ref4, _test)) + 1), _this_test6);
                var b = (_classPrivateFieldSet(_ref5 = this.getInstance(), _test, (_this_test7 = +_classPrivateFieldGet(_ref5, _test)) - 1), _this_test7);
                var c = _classPrivateFieldSet(_ref6 = this.getInstance(), _test, +_classPrivateFieldGet(_ref6, _test) + 1);
                var d = _classPrivateFieldSet(_ref7 = this.getInstance(), _test, +_classPrivateFieldGet(_ref7, _test) - 1);
                for(_classPrivateFieldSet(this.getInstance(), _test, 0); _classPrivateFieldGet(_ref8 = this.getInstance(), _test) < 10; _classPrivateFieldSet(_ref9 = this.getInstance(), _test, +_classPrivateFieldGet(_ref9, _test) + 1)){}
                for(_classPrivateFieldSet(this.getInstance(), _test, 0); _classPrivateFieldGet(_ref10 = this.getInstance(), _test) < 10; _classPrivateFieldSet(_ref11 = this.getInstance(), _test, (_this_test8 = +_classPrivateFieldGet(_ref11, _test)) + 1), _this_test8){}
            }
        },
        {
            key: "getInstance",
            value: function getInstance() {
                return new C();
            }
        }
    ]);
    return C;
}();
var _test = new WeakMap();
