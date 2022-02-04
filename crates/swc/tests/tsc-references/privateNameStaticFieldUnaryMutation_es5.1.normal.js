function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    return descriptor.value;
}
function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
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
        _classStaticPrivateFieldSpecSet(C, C, _test, (_this_test = +_classStaticPrivateFieldSpecGet(C, C, _test)) + 1), _this_test;
        _classStaticPrivateFieldSpecSet(C, C, _test, (_this_test1 = +_classStaticPrivateFieldSpecGet(C, C, _test)) - 1), _this_test1;
        _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) + 1);
        _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) - 1);
        var a = (_classStaticPrivateFieldSpecSet(C, C, _test, (_this_test2 = +_classStaticPrivateFieldSpecGet(C, C, _test)) + 1), _this_test2);
        var b = (_classStaticPrivateFieldSpecSet(C, C, _test, (_this_test3 = +_classStaticPrivateFieldSpecGet(C, C, _test)) - 1), _this_test3);
        var c = _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) + 1);
        var d = _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) - 1);
        for(_classStaticPrivateFieldSpecSet(C, C, _test, 0); _classStaticPrivateFieldSpecGet(C, C, _test) < 10; _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) + 1)){}
        for(_classStaticPrivateFieldSpecSet(C, C, _test, 0); _classStaticPrivateFieldSpecGet(C, C, _test) < 10; _classStaticPrivateFieldSpecSet(C, C, _test, (_this_test4 = +_classStaticPrivateFieldSpecGet(C, C, _test)) + 1), _this_test4){}
    }
    _createClass(C, [
        {
            key: "test",
            value: function test() {
                var _this_test, _this_test5, _this_test6, _this_test7, _this_test8;
                _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, (_this_test = +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test)) + 1), _this_test;
                _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, (_this_test5 = +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test)) - 1), _this_test5;
                _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) + 1);
                _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) - 1);
                var a = (_classStaticPrivateFieldSpecSet(this.getClass(), C, _test, (_this_test6 = +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test)) + 1), _this_test6);
                var b = (_classStaticPrivateFieldSpecSet(this.getClass(), C, _test, (_this_test7 = +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test)) - 1), _this_test7);
                var c = _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) + 1);
                var d = _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) - 1);
                for(_classStaticPrivateFieldSpecSet(this.getClass(), C, _test, 0); _classStaticPrivateFieldSpecGet(this.getClass(), C, _test) < 10; _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) + 1)){}
                for(_classStaticPrivateFieldSpecSet(this.getClass(), C, _test, 0); _classStaticPrivateFieldSpecGet(this.getClass(), C, _test) < 10; _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, (_this_test8 = +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test)) + 1), _this_test8){}
            }
        },
        {
            key: "getClass",
            value: function getClass() {
                return C;
            }
        }
    ]);
    return C;
}();
var _test = {
    writable: true,
    value: 24
};
