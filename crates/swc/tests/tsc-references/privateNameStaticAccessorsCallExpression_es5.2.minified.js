function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
    if (void 0 === descriptor) throw new TypeError("attempted to " + action + " private static field before its declaration");
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    var receiver, descriptor;
    return _classCheckPrivateStaticAccess(receiver, classConstructor), _classCheckPrivateStaticFieldDescriptor(descriptor, "get"), descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _construct(Parent, args, Class) {
    return (_construct = !function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0;
        } catch (e) {
            return !1;
        }
    }() ? function _construct(Parent, args, Class) {
        var a = [
            null
        ];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a), instance = new Constructor();
        return Class && _setPrototypeOf(instance, Class.prototype), instance;
    } : Reflect.construct).apply(null, arguments);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
function _taggedTemplateLiteral(strings, raw) {
    return raw || (raw = strings.slice(0)), Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _toConsumableArray(arr) {
    return (function(arr) {
        if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    })(arr) || (function(iter) {
        if ("undefined" != typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) return Array.from(iter);
    })(arr) || _unsupportedIterableToArray(arr) || (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })();
}
function _unsupportedIterableToArray(o, minLen) {
    if (o) {
        if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
function _templateObject() {
    var data = _taggedTemplateLiteral([
        "head",
        "middle",
        "tail"
    ]);
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
function _templateObject1() {
    var data = _taggedTemplateLiteral([
        "test",
        "and",
        ""
    ]);
    return _templateObject1 = function _templateObject1() {
        return data;
    }, data;
}
var A = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function A() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, A);
    }
    return Constructor = A, protoProps = null, staticProps = [
        {
            key: "test",
            value: function() {
                _classStaticPrivateFieldSpecGet(this, A, _fieldFunc).call(A), _classStaticPrivateFieldSpecGet(this, A, _fieldFunc)(), new (_classStaticPrivateFieldSpecGet(this, A, _fieldFunc))();
                var _instance, arr = [
                    1,
                    2
                ];
                (_instance = _classStaticPrivateFieldSpecGet(this, A, _fieldFunc2)).call.apply(_instance, [
                    A,
                    0
                ].concat(_toConsumableArray(arr), [
                    3
                ])), _construct(_classStaticPrivateFieldSpecGet(this, A, _fieldFunc2), [
                    0
                ].concat(_toConsumableArray(arr), [
                    3
                ])), _classStaticPrivateFieldSpecGet(this, A, _fieldFunc2).bind(A)(_templateObject(), 1, 2), _classStaticPrivateFieldSpecGet(this.getClass(), A, _fieldFunc2).bind(A)(_templateObject1(), 1, 2);
            }
        },
        {
            key: "getClass",
            value: function() {
                return A;
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), A;
}(), _fieldFunc = {
    get: function() {
        return function() {
            var receiver, classConstructor, descriptor, value;
            receiver = A, classConstructor = A, descriptor = _x, value = 10, _classCheckPrivateStaticAccess(receiver, classConstructor), _classCheckPrivateStaticFieldDescriptor(descriptor, "set"), (function(receiver, descriptor, value) {
                if (descriptor.set) descriptor.set.call(receiver, value);
                else {
                    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                    descriptor.value = value;
                }
            })(receiver, descriptor, value);
        };
    },
    set: void 0
}, _fieldFunc2 = {
    get: function() {
        return function(a) {
            for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)b[_key - 1] = arguments[_key];
        };
    },
    set: void 0
}, _x = {
    writable: !0,
    value: 1
};
