import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var E, Flag, Shape = function() {
    "use strict";
    _class_call_check(this, Shape);
}, TaggedShape = function(Shape) {
    "use strict";
    _inherits(TaggedShape, Shape);
    var _super = _create_super(TaggedShape);
    function TaggedShape() {
        return _class_call_check(this, TaggedShape), _super.apply(this, arguments);
    }
    return TaggedShape;
}(Shape), Item = function() {
    "use strict";
    _class_call_check(this, Item);
}, Options = function() {
    "use strict";
    _class_call_check(this, Options);
};
!function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
}(E || (E = {}));
var Component = function() {
    "use strict";
    function Component() {
        _class_call_check(this, Component);
    }
    var _proto = Component.prototype;
    return _proto.getProperty = function(key) {
        return this.props[key];
    }, _proto.setProperty = function(key, value) {
        this.props[key] = value;
    }, Component;
}(), C = function() {
    "use strict";
    _class_call_check(this, C);
}, C1 = function() {
    "use strict";
    function C1() {
        _class_call_check(this, C1);
    }
    var _proto = C1.prototype;
    return _proto.get = function(key) {
        return this[key];
    }, _proto.set = function(key, value) {
        this[key] = value;
    }, _proto.foo = function() {
        var obj, obj1;
        this.x, this.x, this.get("x"), obj = this, obj.x, this.x = 42, this.x = 42, this.set("x", 42), obj1 = this, obj1.x = 42;
    }, C1;
}(), Base = function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    return _proto.get = function(prop) {
        return this[prop];
    }, _proto.set = function(prop, value) {
        this[prop] = value;
    }, Base;
}(), Person = function(Base) {
    "use strict";
    _inherits(Person, Base);
    var _super = _create_super(Person);
    function Person(parts) {
        var _this;
        return _class_call_check(this, Person), (_this = _super.call(this)).set("parts", parts), _this;
    }
    return Person.prototype.getParts = function() {
        return this.get("parts");
    }, Person;
}(Base), OtherPerson = function() {
    "use strict";
    function OtherPerson(parts) {
        var obj, key, value;
        _class_call_check(this, OtherPerson), obj = this, key = "parts", value = parts, obj[key] = value;
    }
    return OtherPerson.prototype.getParts = function() {
        var obj;
        return obj = this, obj.parts;
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
    "use strict";
    _class_call_check(this, A);
}, B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B.prototype.f = function(p) {
        p.x;
    }, B;
}(A), Form = function() {
    "use strict";
    function Form() {
        _class_call_check(this, Form);
    }
    return Form.prototype.set = function(prop, value) {
        this.childFormFactories[prop](value);
    }, Form;
}(), SampleClass = function(props) {
    "use strict";
    _class_call_check(this, SampleClass), this.props = Object.freeze(props);
}, AnotherSampleClass = function(SampleClass) {
    "use strict";
    _inherits(AnotherSampleClass, SampleClass);
    var _super = _create_super(AnotherSampleClass);
    function AnotherSampleClass(props) {
        return _class_call_check(this, AnotherSampleClass), _super.call(this, merge(props, {
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
    "use strict";
    function Unbounded() {
        _class_call_check(this, Unbounded);
    }
    return Unbounded.prototype.foo = function(x) {}, Unbounded;
}();
