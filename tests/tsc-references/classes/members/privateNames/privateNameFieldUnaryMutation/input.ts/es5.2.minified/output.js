function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor.value = value, value;
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        var old;
        for((function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, C), _test.set(this, {
            writable: !0,
            value: 24
        }), _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) + 1), _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) - 1), _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) + 1), _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) - 1), _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) + 1), _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) - 1), _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) + 1), _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) - 1), _classPrivateFieldSet(this, _test, 0); 10 > _classPrivateFieldGet(this, _test); _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) + 1));
        for(_classPrivateFieldSet(this, _test, 0); 10 > _classPrivateFieldGet(this, _test); _classPrivateFieldSet(this, _test, (old = +_classPrivateFieldGet(this, _test)) + 1), old);
    }
    return Constructor = C, protoProps = [
        {
            key: "test",
            value: function() {
                var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, old;
                for(_classPrivateFieldSet(_ref = this.getInstance(), _test, +_classPrivateFieldGet(_ref, _test) + 1), _classPrivateFieldSet(_ref1 = this.getInstance(), _test, +_classPrivateFieldGet(_ref1, _test) - 1), _classPrivateFieldSet(_ref2 = this.getInstance(), _test, +_classPrivateFieldGet(_ref2, _test) + 1), _classPrivateFieldSet(_ref3 = this.getInstance(), _test, +_classPrivateFieldGet(_ref3, _test) - 1), _classPrivateFieldSet(_ref4 = this.getInstance(), _test, +_classPrivateFieldGet(_ref4, _test) + 1), _classPrivateFieldSet(_ref5 = this.getInstance(), _test, +_classPrivateFieldGet(_ref5, _test) - 1), _classPrivateFieldSet(_ref6 = this.getInstance(), _test, +_classPrivateFieldGet(_ref6, _test) + 1), _classPrivateFieldSet(_ref7 = this.getInstance(), _test, +_classPrivateFieldGet(_ref7, _test) - 1), _classPrivateFieldSet(this.getInstance(), _test, 0); 10 > _classPrivateFieldGet(this.getInstance(), _test); _classPrivateFieldSet(_ref8 = this.getInstance(), _test, +_classPrivateFieldGet(_ref8, _test) + 1));
                for(_classPrivateFieldSet(this.getInstance(), _test, 0); 10 > _classPrivateFieldGet(this.getInstance(), _test); _classPrivateFieldSet(_ref9 = this.getInstance(), _test, (old = +_classPrivateFieldGet(_ref9, _test)) + 1), old);
            }
        },
        {
            key: "getInstance",
            value: function() {
                return new C();
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), _test = new WeakMap();
