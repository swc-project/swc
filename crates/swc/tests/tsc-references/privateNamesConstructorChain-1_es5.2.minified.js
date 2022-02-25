function _assertThisInitialized(self) {
    if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return self;
}
function _classApplyDescriptorGet(receiver, descriptor) {
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var _foo = new WeakMap(), Parent = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Parent() {
        _classCallCheck(this, Parent), _classPrivateFieldInit(this, _foo, {
            writable: !0,
            value: 3
        });
    }
    return Constructor = Parent, protoProps = [
        {
            key: "accessChildProps",
            value: function() {
                var receiver, privateMap, descriptor, receiver, classConstructor, descriptor;
                descriptor = (function(receiver, privateMap, action) {
                    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
                    return privateMap.get(receiver);
                })(receiver = new Child(), privateMap = _foo, "get"), _classApplyDescriptorGet(receiver, descriptor), receiver = Child, classConstructor = Parent, descriptor = _bar, (function(receiver, classConstructor) {
                    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
                })(receiver, classConstructor), (function(descriptor, action) {
                    if (void 0 === descriptor) throw new TypeError("attempted to " + action + " private static field before its declaration");
                })(descriptor, "get"), _classApplyDescriptorGet(receiver, descriptor);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Parent;
}(), _bar = {
    writable: !0,
    value: 5
}, _foo1 = new WeakMap(), _bar1 = new WeakMap(), Child = function(Parent) {
    "use strict";
    !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(Child, Parent);
    var Derived, hasNativeReflectConstruct, _super = (Derived = Child, hasNativeReflectConstruct = function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
        } catch (e) {
            return !1;
        }
    }(), function() {
        var obj, self, call, result, Super = _getPrototypeOf(Derived);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else result = Super.apply(this, arguments);
        return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : _assertThisInitialized(self);
    });
    function Child() {
        var _this;
        return _classCallCheck(this, Child), _this = _super.apply(this, arguments), _classPrivateFieldInit(_assertThisInitialized(_this), _foo1, {
            writable: !0,
            value: "foo"
        }), _classPrivateFieldInit(_assertThisInitialized(_this), _bar1, {
            writable: !0,
            value: "bar"
        }), _this;
    }
    return Child;
}(Parent);
