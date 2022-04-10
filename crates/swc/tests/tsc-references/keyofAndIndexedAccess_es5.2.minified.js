import * as swcHelpers from "@swc/helpers";
var E, Flag, Shape = function() {
    swcHelpers.classCallCheck(this, Shape);
}, TaggedShape = function(Shape1) {
    swcHelpers.inherits(TaggedShape, Shape1);
    var _super = swcHelpers.createSuper(TaggedShape);
    function TaggedShape() {
        return swcHelpers.classCallCheck(this, TaggedShape), _super.apply(this, arguments);
    }
    return TaggedShape;
}(Shape), Item = function() {
    swcHelpers.classCallCheck(this, Item);
}, Options = function() {
    swcHelpers.classCallCheck(this, Options);
};
function getProperty(obj, key) {
    return obj[key];
}
function setProperty(obj, key, value) {
    obj[key] = value;
}
!function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
}(E || (E = {}));
var Component = function() {
    function Component() {
        swcHelpers.classCallCheck(this, Component);
    }
    var _proto = Component.prototype;
    return _proto.getProperty = function(key) {
        return this.props[key];
    }, _proto.setProperty = function(key, value) {
        this.props[key] = value;
    }, Component;
}(), C = function() {
    swcHelpers.classCallCheck(this, C);
}, C1 = function() {
    function C1() {
        swcHelpers.classCallCheck(this, C1);
    }
    var _proto = C1.prototype;
    return _proto.get = function(key) {
        return this[key];
    }, _proto.set = function(key, value) {
        this[key] = value;
    }, _proto.foo = function() {
        this.x, this.x, this.get("x"), getProperty(this, "x"), this.x = 42, this.x = 42, this.set("x", 42), setProperty(this, "x", 42);
    }, C1;
}(), Base = function() {
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    var _proto = Base.prototype;
    return _proto.get = function(prop) {
        return this[prop];
    }, _proto.set = function(prop, value) {
        this[prop] = value;
    }, Base;
}(), Person = function(Base) {
    swcHelpers.inherits(Person, Base);
    var _super = swcHelpers.createSuper(Person);
    function Person(parts) {
        var _this;
        return swcHelpers.classCallCheck(this, Person), (_this = _super.call(this)).set("parts", parts), _this;
    }
    return Person.prototype.getParts = function() {
        return this.get("parts");
    }, Person;
}(Base), OtherPerson = function() {
    function OtherPerson(parts) {
        swcHelpers.classCallCheck(this, OtherPerson), setProperty(this, "parts", parts);
    }
    return OtherPerson.prototype.getParts = function() {
        return getProperty(this, "parts");
    }, OtherPerson;
}();
one(function() {}), on({
    test: function() {}
}), on({
    test: function(x) {}
}), new Component1({
    data: {
        hello: ""
    }
}).get("hello"), dispatchMethod("someMethod", [
    "hello",
    35
]);
var A = function() {
    swcHelpers.classCallCheck(this, A);
}, B = function(A1) {
    swcHelpers.inherits(B, A1);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    return B.prototype.f = function(p) {
        p.x;
    }, B;
}(A), Form = function() {
    function Form() {
        swcHelpers.classCallCheck(this, Form);
    }
    return Form.prototype.set = function(prop, value) {
        this.childFormFactories[prop](value);
    }, Form;
}(), SampleClass = function(props) {
    swcHelpers.classCallCheck(this, SampleClass), this.props = Object.freeze(props);
}, AnotherSampleClass = function(SampleClass1) {
    swcHelpers.inherits(AnotherSampleClass, SampleClass1);
    var _super = swcHelpers.createSuper(AnotherSampleClass);
    function AnotherSampleClass(props) {
        return swcHelpers.classCallCheck(this, AnotherSampleClass), _super.call(this, merge(props, {
            foo: "bar"
        }));
    }
    return AnotherSampleClass.prototype.brokenMethod = function() {
        this.props.foo.concat;
    }, AnotherSampleClass;
}(SampleClass);
new AnotherSampleClass({}), function(Flag) {
    Flag.FLAG_1 = "flag_1", Flag.FLAG_2 = "flag_2";
}(Flag || (Flag = {}));
var Unbounded = function() {
    function Unbounded() {
        swcHelpers.classCallCheck(this, Unbounded);
    }
    return Unbounded.prototype.foo = function(x) {}, Unbounded;
}();
