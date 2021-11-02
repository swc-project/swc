function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
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
function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
        _construct = Reflect.construct;
    } else {
        _construct = function _construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _setPrototypeOf(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
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
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
        raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
function _templateObject() {
    var data = _taggedTemplateLiteral([
        "head",
        "middle",
        "tail"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _taggedTemplateLiteral([
        "test",
        "and",
        ""
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
var A = // @target: es2015
/*#__PURE__*/ function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
        var _this = this;
        _fieldFunc.set(this, {
            writable: true,
            value: function value() {
                _this.x = 10;
            }
        });
        _fieldFunc2.set(this, {
            writable: true,
            value: function value(a) {
                for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                    b[_key - 1] = arguments[_key];
                }
            }
        });
        this.x = 1;
    }
    _createClass(A, [
        {
            key: "test",
            value: function test() {
                var _instance;
                var _ref;
                _classPrivateFieldGet(this, _fieldFunc).call(this);
                var func = _classPrivateFieldGet(this, _fieldFunc);
                func();
                new (_classPrivateFieldGet(this, _fieldFunc))();
                var arr = [
                    1,
                    2
                ];
                (_instance = _classPrivateFieldGet(this, _fieldFunc2)).call.apply(_instance, [
                    this,
                    0
                ].concat(_toConsumableArray(arr), [
                    3
                ]));
                var b = _construct(_classPrivateFieldGet(this, _fieldFunc2), [
                    0
                ].concat(_toConsumableArray(arr), [
                    3
                ]));
                var str = _classPrivateFieldGet(this, _fieldFunc2).bind(this)(_templateObject(), 1, 2);
                _classPrivateFieldGet(_ref = this.getInstance(), _fieldFunc2).bind(_ref)(_templateObject1(), 1, 2);
            }
        },
        {
            key: "getInstance",
            value: function getInstance() {
                return new A();
            }
        }
    ]);
    return A;
}();
var _fieldFunc = new WeakMap();
var _fieldFunc2 = new WeakMap();
