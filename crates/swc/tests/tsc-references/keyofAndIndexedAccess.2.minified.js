//// [keyofAndIndexedAccess.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var E, MyThingy, Flag, Shape = function Shape() {
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
}(Shape), Item = function Item() {
    "use strict";
    _class_call_check(this, Item);
}, Options = function Options() {
    "use strict";
    _class_call_check(this, Options);
};
function getProperty(obj, key) {
    return obj[key];
}
function setProperty(obj, key, value) {
    obj[key] = value;
}
function f10(shape) {
    getProperty(shape, "name"), getProperty(shape, cond ? "width" : "height"), getProperty(shape, cond ? "name" : "visible"), setProperty(shape, "name", "rectangle"), setProperty(shape, cond ? "width" : "height", 10), setProperty(shape, cond ? "name" : "visible", !0);
}
function f11(a) {
    var len = getProperty(a, "length");
    setProperty(a, "length", len);
}
function f12(t) {
    getProperty(t, "length"), getProperty(t, "0"), getProperty(t, "1");
}
function f13(foo, bar) {
    getProperty(foo, "x"), getProperty(foo, "100"), getProperty(foo, bar);
}
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
}();
function f20(component) {
    component.getProperty("name"), component.getProperty(cond ? "width" : "height"), component.getProperty(cond ? "name" : "visible"), component.setProperty("name", "rectangle"), component.setProperty(cond ? "width" : "height", 10), component.setProperty(cond ? "name" : "visible", !0);
}
function pluck(array, key) {
    return array.map(function(x) {
        return x[key];
    });
}
function f30(shapes) {
    pluck(shapes, "name"), pluck(shapes, "width"), pluck(shapes, cond ? "name" : "visible");
}
function f31(key) {
    return ({
        name: "foo",
        width: 5,
        height: 10,
        visible: !0
    })[key];
}
function f32(key) {
    return ({
        name: "foo",
        width: 5,
        height: 10,
        visible: !0
    })[key];
}
function f33(shape, key) {
    return getProperty(shape, "name"), getProperty(shape, key);
}
function f34(ts) {
    f33(ts, "tag"), getProperty(ts, "tag");
}
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
function f40(c) {
    c.x, c.y, c.z;
}
function f50(k, s) {}
function f51(k, s) {}
function f52(obj, k, s, n) {
    obj[s], obj[n], obj[k];
}
function f53(obj, k, s, n) {
    obj[s], obj[n], obj[k];
}
function f54(obj, key) {
    for(var s in obj[key]);
    obj[key];
}
function f55(obj, key) {
    for(var s in obj[key]);
    obj[key];
}
function f60(source, target) {
    for(var k in source)target[k] = source[k];
}
function f70(func) {
    func("a", "a"), func("a", "b"), func("a", "c");
}
function f71(func) {
    var x = func({
        a: 1,
        b: "hello"
    }, {
        c: !0
    });
    x.a, x.b, x.c;
}
function f72(func) {
    func({
        a: 1,
        b: "hello"
    }, {
        c: !0
    }, "a"), func({
        a: 1,
        b: "hello"
    }, {
        c: !0
    }, "b"), func({
        a: 1,
        b: "hello"
    }, {
        c: !0
    }, "c");
}
function f73(func) {
    func({
        a: 1,
        b: "hello"
    }, {
        c: !0
    }, "a"), func({
        a: 1,
        b: "hello"
    }, {
        c: !0
    }, "b"), func({
        a: 1,
        b: "hello"
    }, {
        c: !0
    }, "c");
}
function f74(func) {
    func({
        a: 1,
        b: "hello"
    }, {
        a: 2,
        b: !0
    }, "a"), func({
        a: 1,
        b: "hello"
    }, {
        a: 2,
        b: !0
    }, "b");
}
function f80(obj) {
    obj.a, obj.a, obj.a, obj.a.x, obj.a.x, obj.a.x;
}
function f81(obj) {
    return obj.a.x;
}
function f82() {
    f81({
        a: {
            x: "hello"
        }
    }), f81({
        a: {
            x: 42
        }
    });
}
function f83(obj, key) {
    return obj[key].x;
}
function f84() {
    f83({
        foo: {
            x: "hello"
        }
    }, "foo"), f83({
        bar: {
            x: 42
        }
    }, "bar");
}
var C1 = function() {
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
        this.x, this.x, this.get("x"), getProperty(this, "x"), this.x = 42, this.x = 42, this.set("x", 42), setProperty(this, "x", 42);
    }, C1;
}();
function f90(x1, x2, x3) {
    x1 = x2, x2 = x1 = x3, x2 = x3, x3 = x1, x3 = x2, x1.length, x2.length, x3.length;
}
function f91(x, y, z) {}
function f92(x, y, z) {}
var Base = function() {
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
        _class_call_check(this, OtherPerson), setProperty(this, "parts", parts);
    }
    return OtherPerson.prototype.getParts = function() {
        return getProperty(this, "parts");
    }, OtherPerson;
}();
function path(obj) {
    for(var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)keys[_key - 1] = arguments[_key];
    var result = obj, _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
    try {
        for(var _step, _iterator = keys[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)result = result[_step.value];
    } catch (err) {
        _didIteratorError = !0, _iteratorError = err;
    } finally{
        try {
            _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
        } finally{
            if (_didIteratorError) throw _iteratorError;
        }
    }
    return result;
}
function f1(thing) {
    path(thing, "a"), path(thing, "a", "y"), path(thing, "b"), path.apply(void 0, [
        thing,
        "a",
        "x"
    ]);
}
var assignTo2 = function(object, key1, key2) {
    return function(value) {
        return object[key1][key2] = value;
    };
}, empty = one(function() {}), hashOfEmpty1 = on({
    test: function() {}
}), hashOfEmpty2 = on({
    test: function(x) {}
}), c1 = new Component1({
    data: {
        hello: ""
    }
});
function f(p) {
    (void 0)[p].add;
}
c1.get("hello");
var result = dispatchMethod("someMethod", [
    "hello",
    35
]);
function addToMyThingy(key) {
    MyThingy[key].push("a");
}
function onChangeGenericFunction(handler) {
    handler.onChange("preset");
}
function updateIds(obj, idFields, idMapping) {
    var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
    try {
        for(var _step, _iterator = idFields[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0){
            var idField = _step.value, newId = idMapping[obj[idField]];
            newId && (obj[idField] = newId);
        }
    } catch (err) {
        _didIteratorError = !0, _iteratorError = err;
    } finally{
        try {
            _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
        } finally{
            if (_didIteratorError) throw _iteratorError;
        }
    }
    return obj;
}
function updateIds2(obj, key, stringMap) {
    stringMap[obj[key]];
}
var A = function A() {
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
}(), SampleClass = function SampleClass(props) {
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
function f3(t, k, tk) {
    for(var key in t)t[k] = tk;
}
function getFlagsFromSimpleRecord(record, flags) {
    return record[flags[0]];
}
function getFlagsFromDynamicRecord(record, flags) {
    return record[flags[0]];
}
function fn(o, k) {
    take(o[k]), take(o[k]);
}
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
function ff1(dd, k1, k2) {
    return dd[k1][k2];
}
function ff2(dd, k1, k2) {
    return dd[k1][k2];
}
var cf1 = function(t, k) {
    t[k], t.cool;
}, cf2 = function(t, k) {
    t[k], t.cool;
};
