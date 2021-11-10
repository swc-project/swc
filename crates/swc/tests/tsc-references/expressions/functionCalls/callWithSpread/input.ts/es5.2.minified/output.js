function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
function _get(target, property, receiver) {
    return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (base) {
            var desc = Object.getOwnPropertyDescriptor(base, property);
            return desc.get ? desc.get.call(receiver) : desc.value;
        }
    }, _get(target, property, receiver || target);
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
function _superPropBase(object, property) {
    for(; !Object.prototype.hasOwnProperty.call(object, property) && null !== (object = _getPrototypeOf(object)););
    return object;
}
function _toConsumableArray(arr) {
    return (function(arr) {
        if (Array.isArray(arr)) {
            for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
            return arr2;
        }
    })(arr) || (function(iter) {
        if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
    })(arr) || (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
    })();
}
function foo(x, y) {
    for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
}
foo(1, 2, "abc"), foo.apply(void 0, [
    1,
    2
].concat(_toConsumableArray(a))), foo.apply(void 0, [
    1,
    2
].concat(_toConsumableArray(a), [
    "abc"
])), obj1.foo(1, 2, "abc"), (_obj = obj1).foo.apply(_obj, [
    1,
    2
].concat(_toConsumableArray(a))), (_obj1 = obj1).foo.apply(_obj1, [
    1,
    2
].concat(_toConsumableArray(a), [
    "abc"
])), (_obj2 = obj1).foo.apply(_obj2, [
    1,
    2
].concat(_toConsumableArray(a))).foo(1, 2, "abc"), (_instance4 = (_obj3 = obj1).foo.apply(_obj3, [
    1,
    2
].concat(_toConsumableArray(a)))).foo.apply(_instance4, [
    1,
    2
].concat(_toConsumableArray(a))), (_instance1 = (_obj4 = obj1).foo.apply(_obj4, [
    1,
    2
].concat(_toConsumableArray(a)))).foo.apply(_instance1, [
    1,
    2
].concat(_toConsumableArray(a), [
    "abc"
])), obj1.foo(1, 2, "abc"), obj1.foo.apply(this, [
    1,
    2
].concat(_toConsumableArray(a))), obj1.foo.apply(this, [
    1,
    2
].concat(_toConsumableArray(a), [
    "abc"
])), obj1.foo.apply(this, [
    1,
    2
].concat(_toConsumableArray(a))).foo(1, 2, "abc"), obj1.foo.apply(this, [
    1,
    2
].concat(_toConsumableArray(a))).foo.apply(this, [
    1,
    2
].concat(_toConsumableArray(a))), obj1.foo.apply(this, [
    1,
    2
].concat(_toConsumableArray(a))).foo.apply(this, [
    1,
    2
].concat(_toConsumableArray(a), [
    "abc"
])), xa[1].foo(1, 2, "abc"), (_instance2 = xa[1]).foo.apply(_instance2, [
    1,
    2
].concat(_toConsumableArray(a))), (_instance3 = xa[1]).foo.apply(_instance3, [
    1,
    2
].concat(_toConsumableArray(a), [
    "abc"
])), xa[1].foo.apply(this, [
    1,
    2,
    "abc"
]);
var _obj, _obj1, _obj2, _obj3, _instance4, _obj4, _instance1, _instance2, _instance3, a, obj1, xa, C = function() {
    "use strict";
    function C(x, y) {
        for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
        _classCallCheck(this, C), this.foo(x, y), this.foo.apply(this, [
            x,
            y
        ].concat(_toConsumableArray(z)));
    }
    return _createClass(C, [
        {
            key: "foo",
            value: function(x, y) {
                for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
            }
        }
    ]), C;
}(), D = function(C) {
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
    }(D, C);
    var _super = function(Derived) {
        var hasNativeReflectConstruct = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
                })), !0;
            } catch (e) {
                return !1;
            }
        }();
        return function() {
            var obj, self, call, result, Super = _getPrototypeOf(Derived);
            if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
            } else result = Super.apply(this, arguments);
            return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
                if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return self;
            })(self);
        };
    }(D);
    function D() {
        return _classCallCheck(this, D), _super.call(this, 1, 2);
    }
    return _createClass(D, [
        {
            key: "foo",
            value: function() {
                var _instance;
                _get(_getPrototypeOf(D.prototype), "foo", this).call(this, 1, 2), (_instance = _get(_getPrototypeOf(D.prototype), "foo", this)).call.apply(_instance, [
                    this,
                    1,
                    2
                ].concat(_toConsumableArray(a)));
            }
        }
    ]), D;
}(C);
