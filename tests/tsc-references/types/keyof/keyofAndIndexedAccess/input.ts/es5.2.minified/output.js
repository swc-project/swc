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
function _possibleConstructorReturn(self, call) {
    return call && ("object" === _typeof(call) || "function" == typeof call) ? call : (function(self) {
        if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    })(self);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var Flag, E, Flag1, E1, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, Shape = function() {
    "use strict";
    _classCallCheck(this, Shape);
}, TaggedShape = function(Shape) {
    "use strict";
    function TaggedShape() {
        return _classCallCheck(this, TaggedShape), _possibleConstructorReturn(this, _getPrototypeOf(TaggedShape).apply(this, arguments));
    }
    return _inherits(TaggedShape, Shape), TaggedShape;
}(Shape), Item = function() {
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
    function Person(parts) {
        var _this;
        return _classCallCheck(this, Person), (_this = _possibleConstructorReturn(this, _getPrototypeOf(Person).call(this))).set("parts", parts), _this;
    }
    return _inherits(Person, Base), _createClass(Person, [
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
var A = function() {
    "use strict";
    _classCallCheck(this, A);
}, B = function(A) {
    "use strict";
    function B() {
        return _classCallCheck(this, B), _possibleConstructorReturn(this, _getPrototypeOf(B).apply(this, arguments));
    }
    return _inherits(B, A), _createClass(B, [
        {
            key: "f",
            value: function(p) {
                p.x;
            }
        }
    ]), B;
}(A), Form = function() {
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
}(), SampleClass = function(props) {
    "use strict";
    _classCallCheck(this, SampleClass), this.props = Object.freeze(props);
}, AnotherSampleClass = function(SampleClass) {
    "use strict";
    function AnotherSampleClass(props) {
        return _classCallCheck(this, AnotherSampleClass), _possibleConstructorReturn(this, _getPrototypeOf(AnotherSampleClass).call(this, merge(props, {
            foo: "bar"
        })));
    }
    return _inherits(AnotherSampleClass, SampleClass), _createClass(AnotherSampleClass, [
        {
            key: "brokenMethod",
            value: function() {
                this.props.foo.concat;
            }
        }
    ]), AnotherSampleClass;
}(SampleClass);
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
