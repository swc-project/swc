function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
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
function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
        _get = Reflect.get;
    } else {
        _get = function _get(target, property, receiver) {
            var base = _superPropBase(target, property);
            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);
            if (desc.get) {
                return desc.get.call(receiver);
            }
            return desc.value;
        };
    }
    return _get(target, property, receiver || target);
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
function _superPropBase(object, property) {
    while(!Object.prototype.hasOwnProperty.call(object, property)){
        object = _getPrototypeOf(object);
        if (object === null) break;
    }
    return object;
}
var _typeof = function(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
// @strict: true
// @allowUnreachableCode: false
// @declaration: true
function fail(message) {
    throw new Error(message);
}
function f01(x) {
    if (x === undefined) fail("undefined argument");
    x.length; // string
}
function f02(x) {
    if (x >= 0) return x;
    fail("negative number");
    x; // Unreachable
}
function f03(x) {
    x; // string
    fail();
    x; // Unreachable
}
function f11(x, fail1) {
    if (x === undefined) fail1("undefined argument");
    x.length; // string
}
function f12(x, fail2) {
    if (x >= 0) return x;
    fail2("negative number");
    x; // Unreachable
}
function f13(x, fail3) {
    x; // string
    fail3();
    x; // Unreachable
}
function f21(x) {
    if (x === undefined) Debug.fail("undefined argument");
    x.length; // string
}
function f22(x) {
    if (x >= 0) return x;
    Debug.fail("negative number");
    x; // Unreachable
}
function f23(x) {
    x; // string
    Debug.fail();
    x; // Unreachable
}
function f24(x) {
    x; // string
    Debug.fail();
    x; // Unreachable
}
var Test = /*#__PURE__*/ function() {
    "use strict";
    function Test() {
        _classCallCheck(this, Test);
    }
    _createClass(Test, [
        {
            key: "fail",
            value: function fail(message) {
                throw new Error(message);
            }
        },
        {
            key: "f1",
            value: function f1(x) {
                if (x === undefined) this.fail("undefined argument");
                x.length; // string
            }
        },
        {
            key: "f2",
            value: function f2(x) {
                if (x >= 0) return x;
                this.fail("negative number");
                x; // Unreachable
            }
        },
        {
            key: "f3",
            value: function f3(x) {
                x; // string
                this.fail();
                x; // Unreachable
            }
        }
    ]);
    return Test;
}();
function f30(x) {
    if (typeof x === "string") {
        fail();
        x; // Unreachable
    } else {
        x; // number | undefined
        if (x !== undefined) {
            x; // number
            fail();
            x; // Unreachable
        } else {
            x; // undefined
            fail();
            x; // Unreachable
        }
        x; // Unreachable
    }
    x; // Unreachable
}
function f31(x) {
    if (typeof x.a === "string") {
        fail();
        x; // Unreachable
        x.a; // Unreachable
    }
    x; // { a: string | number }
    x.a; // number
}
function f40(x) {
    try {
        x;
        fail();
        x; // Unreachable
    } finally{
        x;
        fail();
        x; // Unreachable
    }
    x; // Unreachable
}
function f41(x) {
    try {
        x;
    } finally{
        x;
        fail();
        x; // Unreachable
    }
    x; // Unreachable
}
function f42(x) {
    try {
        x;
        fail();
        x; // Unreachable
    } finally{
        x;
    }
    x; // Unreachable
}
function f43() {
    var fail4 = function() {
        throw new Error();
    };
    var f = [
        fail4
    ];
    fail4(); // No effect (missing type annotation)
    f[0](); // No effect (not a dotted name)
    f;
}
var Component = registerComponent('test-component', {
    schema: {
        myProperty: {
            default: [],
            parse: function parse() {
                return [
                    true
                ];
            }
        },
        string: {
            type: 'string'
        },
        num: 0
    },
    init: function init() {
        this.data.num = 0;
        this.el.setAttribute('custom-attribute', 'custom-value');
    },
    update: function update() {},
    tick: function tick() {},
    remove: function remove() {},
    pause: function pause() {},
    play: function play() {},
    multiply: function multiply(f) {
        // Reference to system because both were registered with the same name.
        return f * this.data.num * this.system.data.counter;
    }
});
var MyThrowable = // Repro from #36147
/*#__PURE__*/ function() {
    "use strict";
    function MyThrowable() {
        _classCallCheck(this, MyThrowable);
    }
    _createClass(MyThrowable, [
        {
            key: "throw",
            value: function _throw() {
                throw new Error();
            }
        }
    ]);
    return MyThrowable;
}();
var SuperThrowable = /*#__PURE__*/ function(MyThrowable) {
    "use strict";
    _inherits(SuperThrowable, MyThrowable);
    var _super = _createSuper(SuperThrowable);
    function SuperThrowable() {
        _classCallCheck(this, SuperThrowable);
        return _super.apply(this, arguments);
    }
    _createClass(SuperThrowable, [
        {
            key: "err",
            value: function err(msg) {
                _get(_getPrototypeOf(SuperThrowable.prototype), "throw", this).call(this);
            }
        },
        {
            key: "ok",
            value: function ok() {
                this.throw();
            }
        }
    ]);
    return SuperThrowable;
}(MyThrowable);
function foo(services, s) {
    if (s === null) {
        services.panic("ouch");
    } else {
        return s;
    }
}
export { };
