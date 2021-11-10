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
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: !0,
            configurable: !0
        }
    }), superClass && _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
function _createSuper(Derived) {
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
}
var Flag, E, Flag1, E1, Shape1 = function() {
    "use strict";
    _classCallCheck(this, Shape1);
}, TaggedShape = function(Shape) {
    "use strict";
    _inherits(TaggedShape, Shape);
    var _super = _createSuper(TaggedShape);
    function TaggedShape() {
        return _classCallCheck(this, TaggedShape), _super.apply(this, arguments);
    }
    return TaggedShape;
}(Shape1), Item = function() {
    "use strict";
    _classCallCheck(this, Item);
}, Options = function() {
    "use strict";
    _classCallCheck(this, Options);
};
function getProperty(obj, key) {
    return obj[key];
}
function setProperty(obj, key, value) {
    obj[key] = value;
}
(E1 = E || (E = {
}))[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C";
var Component = function() {
    "use strict";
    function Component() {
        _classCallCheck(this, Component);
    }
    return _createClass(Component, [
        {
            key: "getProperty",
            value: function(key) {
                return this.props[key];
            }
        },
        {
            key: "setProperty",
            value: function(key, value) {
                this.props[key] = value;
            }
        }
    ]), Component;
}(), C = function() {
    "use strict";
    _classCallCheck(this, C);
}, C1 = function() {
    "use strict";
    function C1() {
        _classCallCheck(this, C1);
    }
    return _createClass(C1, [
        {
            key: "get",
            value: function(key) {
                return this[key];
            }
        },
        {
            key: "set",
            value: function(key, value) {
                this[key] = value;
            }
        },
        {
            key: "foo",
            value: function() {
                this.x, this.x, this.get("x"), getProperty(this, "x"), this.x = 42, this.x = 42, this.set("x", 42), setProperty(this, "x", 42);
            }
        }
    ]), C1;
}(), Base = function() {
    "use strict";
    function Base() {
        _classCallCheck(this, Base);
    }
    return _createClass(Base, [
        {
            key: "get",
            value: function(prop) {
                return this[prop];
            }
        },
        {
            key: "set",
            value: function(prop, value) {
                this[prop] = value;
            }
        }
    ]), Base;
}(), Person = function(Base) {
    "use strict";
    _inherits(Person, Base);
    var _super = _createSuper(Person);
    function Person(parts) {
        var _this;
        return _classCallCheck(this, Person), (_this = _super.call(this)).set("parts", parts), _this;
    }
    return _createClass(Person, [
        {
            key: "getParts",
            value: function() {
                return this.get("parts");
            }
        }
    ]), Person;
}(Base), OtherPerson = function() {
    "use strict";
    function OtherPerson(parts) {
        _classCallCheck(this, OtherPerson), setProperty(this, "parts", parts);
    }
    return _createClass(OtherPerson, [
        {
            key: "getParts",
            value: function() {
                return getProperty(this, "parts");
            }
        }
    ]), OtherPerson;
}();
one(function() {
}), on({
    test: function() {
    }
}), on({
    test: function(x) {
    }
}), new Component1({
    data: {
        hello: ""
    }
}).get("hello"), dispatchMethod("someMethod", [
    "hello",
    35
]);
var A1 = function() {
    "use strict";
    _classCallCheck(this, A1);
}, B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _createSuper(B);
    function B() {
        return _classCallCheck(this, B), _super.apply(this, arguments);
    }
    return _createClass(B, [
        {
            key: "f",
            value: function(p) {
                p.x;
            }
        }
    ]), B;
}(A1), Form = function() {
    "use strict";
    function Form() {
        _classCallCheck(this, Form);
    }
    return _createClass(Form, [
        {
            key: "set",
            value: function(prop, value) {
                this.childFormFactories[prop](value);
            }
        }
    ]), Form;
}(), SampleClass1 = function(props) {
    "use strict";
    _classCallCheck(this, SampleClass1), this.props = Object.freeze(props);
}, AnotherSampleClass = function(SampleClass) {
    "use strict";
    _inherits(AnotherSampleClass, SampleClass);
    var _super = _createSuper(AnotherSampleClass);
    function AnotherSampleClass(props) {
        return _classCallCheck(this, AnotherSampleClass), _super.call(this, merge(props, {
            foo: "bar"
        }));
    }
    return _createClass(AnotherSampleClass, [
        {
            key: "brokenMethod",
            value: function() {
                this.props.foo.concat;
            }
        }
    ]), AnotherSampleClass;
}(SampleClass1);
new AnotherSampleClass({
}), (Flag = Flag1 || (Flag1 = {
})).FLAG_1 = "flag_1", Flag.FLAG_2 = "flag_2";
var Unbounded = function() {
    "use strict";
    function Unbounded() {
        _classCallCheck(this, Unbounded);
    }
    return _createClass(Unbounded, [
        {
            key: "foo",
            value: function(x) {
            }
        }
    ]), Unbounded;
}();
