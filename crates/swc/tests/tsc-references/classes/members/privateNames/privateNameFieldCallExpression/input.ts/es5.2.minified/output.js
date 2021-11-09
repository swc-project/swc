function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
}
function _construct(Parent, args, Class) {
    return (_construct = !function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Date.prototype.toString.call(Reflect.construct(Date, [], function() {
            })), !0;
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
        var _this = this;
        _fieldFunc.set(this, {
            writable: !0,
            value: function() {
                _this.x = 10;
            }
        }), _fieldFunc2.set(this, {
            writable: !0,
            value: function(a) {
                for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)b[_key - 1] = arguments[_key];
            }
        }), this.x = 1;
    }
    return Constructor = A, protoProps = [
        {
            key: "test",
            value: function() {
                var _instance, _ref;
                _classPrivateFieldGet(this, _fieldFunc).call(this), _classPrivateFieldGet(this, _fieldFunc)(), new (_classPrivateFieldGet(this, _fieldFunc))();
                var arr = [
                    1,
                    2
                ];
                (_instance = _classPrivateFieldGet(this, _fieldFunc2)).call.apply(_instance, [
                    this,
                    0
                ].concat(_toConsumableArray(arr), [
                    3
                ])), _construct(_classPrivateFieldGet(this, _fieldFunc2), [
                    0
                ].concat(_toConsumableArray(arr), [
                    3
                ])), _classPrivateFieldGet(this, _fieldFunc2).bind(this)(_templateObject(), 1, 2), _classPrivateFieldGet(_ref = this.getInstance(), _fieldFunc2).bind(_ref)(_templateObject1(), 1, 2);
            }
        },
        {
            key: "getInstance",
            value: function() {
                return new A();
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), A;
}(), _fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap();
