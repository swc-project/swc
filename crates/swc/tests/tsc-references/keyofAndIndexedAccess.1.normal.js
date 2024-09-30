//// [keyofAndIndexedAccess.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Shape = function Shape() {
    "use strict";
    _class_call_check(this, Shape);
};
var TaggedShape = /*#__PURE__*/ function(Shape) {
    "use strict";
    _inherits(TaggedShape, Shape);
    function TaggedShape() {
        _class_call_check(this, TaggedShape);
        return _call_super(this, TaggedShape, arguments);
    }
    return TaggedShape;
}(Shape);
var Item = function Item() {
    "use strict";
    _class_call_check(this, Item);
};
var Options = function Options() {
    "use strict";
    _class_call_check(this, Options);
};
;
function getProperty(obj, key) {
    return obj[key];
}
function setProperty(obj, key, value) {
    obj[key] = value;
}
function f10(shape) {
    var name = getProperty(shape, "name"); // string
    var widthOrHeight = getProperty(shape, cond ? "width" : "height"); // number
    var nameOrVisible = getProperty(shape, cond ? "name" : "visible"); // string | boolean
    setProperty(shape, "name", "rectangle");
    setProperty(shape, cond ? "width" : "height", 10);
    setProperty(shape, cond ? "name" : "visible", true); // Technically not safe
}
function f11(a) {
    var len = getProperty(a, "length"); // number
    setProperty(a, "length", len);
}
function f12(t) {
    var len = getProperty(t, "length");
    var s2 = getProperty(t, "0"); // Shape
    var b2 = getProperty(t, "1"); // boolean
}
function f13(foo, bar) {
    var x = getProperty(foo, "x"); // any
    var y = getProperty(foo, "100"); // any
    var z = getProperty(foo, bar); // any
}
var Component = /*#__PURE__*/ function() {
    "use strict";
    function Component() {
        _class_call_check(this, Component);
    }
    var _proto = Component.prototype;
    _proto.getProperty = function getProperty(key) {
        return this.props[key];
    };
    _proto.setProperty = function setProperty(key, value) {
        this.props[key] = value;
    };
    return Component;
}();
function f20(component) {
    var name = component.getProperty("name"); // string
    var widthOrHeight = component.getProperty(cond ? "width" : "height"); // number
    var nameOrVisible = component.getProperty(cond ? "name" : "visible"); // string | boolean
    component.setProperty("name", "rectangle");
    component.setProperty(cond ? "width" : "height", 10);
    component.setProperty(cond ? "name" : "visible", true); // Technically not safe
}
function pluck(array, key) {
    return array.map(function(x) {
        return x[key];
    });
}
function f30(shapes) {
    var names = pluck(shapes, "name"); // string[]
    var widths = pluck(shapes, "width"); // number[]
    var nameOrVisibles = pluck(shapes, cond ? "name" : "visible"); // (string | boolean)[]
}
function f31(key) {
    var shape = {
        name: "foo",
        width: 5,
        height: 10,
        visible: true
    };
    return shape[key]; // Shape[K]
}
function f32(key) {
    var shape = {
        name: "foo",
        width: 5,
        height: 10,
        visible: true
    };
    return shape[key]; // Shape[K]
}
function f33(shape, key) {
    var name = getProperty(shape, "name");
    var prop = getProperty(shape, key);
    return prop;
}
function f34(ts) {
    var tag1 = f33(ts, "tag");
    var tag2 = getProperty(ts, "tag");
}
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
// Indexed access expressions have always permitted access to private and protected members.
// For consistency we also permit such access in indexed access types.
function f40(c) {
    var x = c["x"];
    var y = c["y"];
    var z = c["z"];
}
function f50(k, s) {
    var x1 = s;
    var x2 = k;
}
function f51(k, s) {
    var x1 = s;
    var x2 = k;
}
function f52(obj, k, s, n) {
    var x1 = obj[s];
    var x2 = obj[n];
    var x3 = obj[k];
}
function f53(obj, k, s, n) {
    var x1 = obj[s];
    var x2 = obj[n];
    var x3 = obj[k];
}
function f54(obj, key) {
    for(var s in obj[key]){}
    var b = "foo" in obj[key];
}
function f55(obj, key) {
    for(var s in obj[key]){}
    var b = "foo" in obj[key];
}
function f60(source, target) {
    for(var k in source){
        target[k] = source[k];
    }
}
function f70(func) {
    func('a', 'a');
    func('a', 'b');
    func('a', 'c');
}
function f71(func) {
    var x = func({
        a: 1,
        b: "hello"
    }, {
        c: true
    });
    x.a; // number | undefined
    x.b; // string | undefined
    x.c; // boolean | undefined
}
function f72(func) {
    var a = func({
        a: 1,
        b: "hello"
    }, {
        c: true
    }, 'a'); // number
    var b = func({
        a: 1,
        b: "hello"
    }, {
        c: true
    }, 'b'); // string
    var c = func({
        a: 1,
        b: "hello"
    }, {
        c: true
    }, 'c'); // boolean
}
function f73(func) {
    var a = func({
        a: 1,
        b: "hello"
    }, {
        c: true
    }, 'a'); // number
    var b = func({
        a: 1,
        b: "hello"
    }, {
        c: true
    }, 'b'); // string
    var c = func({
        a: 1,
        b: "hello"
    }, {
        c: true
    }, 'c'); // boolean
}
function f74(func) {
    var a = func({
        a: 1,
        b: "hello"
    }, {
        a: 2,
        b: true
    }, 'a'); // number
    var b = func({
        a: 1,
        b: "hello"
    }, {
        a: 2,
        b: true
    }, 'b'); // string | boolean
}
function f80(obj) {
    var a1 = obj.a; // { x: any }
    var a2 = obj['a']; // { x: any }
    var a3 = obj['a']; // T["a"]
    var x1 = obj.a.x; // any
    var x2 = obj['a']['x']; // any
    var x3 = obj['a']['x']; // T["a"]["x"]
}
function f81(obj) {
    return obj['a']['x'];
}
function f82() {
    var x1 = f81({
        a: {
            x: "hello"
        }
    }); // string
    var x2 = f81({
        a: {
            x: 42
        }
    }); // number
}
function f83(obj, key) {
    return obj[key]['x'];
}
function f84() {
    var x1 = f83({
        foo: {
            x: "hello"
        }
    }, "foo"); // string
    var x2 = f83({
        bar: {
            x: 42
        }
    }, "bar"); // number
}
var C1 = /*#__PURE__*/ function() {
    "use strict";
    function C1() {
        _class_call_check(this, C1);
    }
    var _proto = C1.prototype;
    _proto.get = function get(key) {
        return this[key];
    };
    _proto.set = function set(key, value) {
        this[key] = value;
    };
    _proto.foo = function foo() {
        var x1 = this.x; // number
        var x2 = this["x"]; // number
        var x3 = this.get("x"); // this["x"]
        var x4 = getProperty(this, "x"); // this["x"]
        this.x = 42;
        this["x"] = 42;
        this.set("x", 42);
        setProperty(this, "x", 42);
    };
    return C1;
}();
function f90(x1, x2, x3) {
    x1 = x2;
    x1 = x3;
    x2 = x1;
    x2 = x3;
    x3 = x1;
    x3 = x2;
    x1.length;
    x2.length;
    x3.length;
}
function f91(x, y, z) {
    var a;
    a = x;
    a = y;
    a = z;
}
function f92(x, y, z) {
    var a;
    a = x;
    a = y;
    a = z;
}
// Repros from #12011
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    _proto.get = function get(prop) {
        return this[prop];
    };
    _proto.set = function set(prop, value) {
        this[prop] = value;
    };
    return Base;
}();
var Person = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Person, Base);
    function Person(parts) {
        _class_call_check(this, Person);
        var _this;
        _this = _call_super(this, Person);
        _this.set("parts", parts);
        return _this;
    }
    var _proto = Person.prototype;
    _proto.getParts = function getParts() {
        return this.get("parts");
    };
    return Person;
}(Base);
var OtherPerson = /*#__PURE__*/ function() {
    "use strict";
    function OtherPerson(parts) {
        _class_call_check(this, OtherPerson);
        setProperty(this, "parts", parts);
    }
    var _proto = OtherPerson.prototype;
    _proto.getParts = function getParts() {
        return getProperty(this, "parts");
    };
    return OtherPerson;
}();
function path(obj) {
    for(var _len = arguments.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        keys[_key - 1] = arguments[_key];
    }
    var result = obj;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var k = _step.value;
            result = result[k];
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return result;
}
function f1(thing) {
    var x1 = path(thing, 'a'); // { x: number, y: string }
    var x2 = path(thing, 'a', 'y'); // string
    var x3 = path(thing, 'b'); // boolean
    var x4 = path.apply(void 0, [
        thing,
        'a',
        'x'
    ]); // any
}
// Repro from comment in #12114
var assignTo2 = function(object, key1, key2) {
    return function(value) {
        return object[key1][key2] = value;
    };
};
var empty = one(function() {}) // inferred as {}, expected
;
var hashOfEmpty1 = on({
    test: function() {}
}); // {}
var hashOfEmpty2 = on({
    test: function(x) {}
}); // { test: boolean }
var c1 = new Component1({
    data: {
        hello: ""
    }
});
c1.get("hello");
function f(p) {
    var a;
    a[p].add; // any
}
var result = dispatchMethod("someMethod", [
    "hello",
    35
]);
var MyThingy;
function addToMyThingy(key) {
    MyThingy[key].push("a");
}
function onChangeGenericFunction(handler) {
    handler.onChange('preset');
}
// Repro from #13285
function updateIds(obj, idFields, idMapping) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = idFields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var idField = _step.value;
            var newId = idMapping[obj[idField]];
            if (newId) {
                obj[idField] = newId;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return obj;
}
// Repro from #13285
function updateIds2(obj, key, stringMap) {
    var x = obj[key];
    stringMap[x]; // Should be OK.
}
// Repro from #13604
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B() {
        _class_call_check(this, B);
        return _call_super(this, B, arguments);
    }
    var _proto = B.prototype;
    _proto.f = function f(p) {
        p.x;
    };
    return B;
}(A);
// Repro from #13749
var Form = /*#__PURE__*/ function() {
    "use strict";
    function Form() {
        _class_call_check(this, Form);
    }
    var _proto = Form.prototype;
    _proto.set = function set(prop, value) {
        this.childFormFactories[prop](value);
    };
    return Form;
}();
// Repro from #13787
var SampleClass = function SampleClass(props) {
    "use strict";
    _class_call_check(this, SampleClass);
    this.props = Object.freeze(props);
};
var AnotherSampleClass = /*#__PURE__*/ function(SampleClass) {
    "use strict";
    _inherits(AnotherSampleClass, SampleClass);
    function AnotherSampleClass(props) {
        _class_call_check(this, AnotherSampleClass);
        var foo = {
            foo: "bar"
        };
        return _call_super(this, AnotherSampleClass, [
            merge(props, foo)
        ]);
    }
    var _proto = AnotherSampleClass.prototype;
    _proto.brokenMethod = function brokenMethod() {
        this.props.foo.concat;
    };
    return AnotherSampleClass;
}(SampleClass);
new AnotherSampleClass({});
// Positive repro from #17166
function f3(t, k, tk) {
    for(var key in t){
        key = k // ok, K ==> keyof T
        ;
        t[key] = tk; // ok, T[K] ==> T[keyof T]
    }
}
var Flag = /*#__PURE__*/ function(Flag) {
    Flag["FLAG_1"] = "flag_1";
    Flag["FLAG_2"] = "flag_2";
    return Flag;
}(Flag || {});
function getFlagsFromSimpleRecord(record, flags) {
    return record[flags[0]];
}
function getFlagsFromDynamicRecord(record, flags) {
    return record[flags[0]];
}
function fn(o, k) {
    take(o[k]);
    take(o[k]);
}
// Repro from #23133
var Unbounded = /*#__PURE__*/ function() {
    "use strict";
    function Unbounded() {
        _class_call_check(this, Unbounded);
    }
    var _proto = Unbounded.prototype;
    _proto.foo = function foo(x) {
        var y = x;
    };
    return Unbounded;
}();
function ff1(dd, k1, k2) {
    return dd[k1][k2];
}
function ff2(dd, k1, k2) {
    var d = dd[k1];
    return d[k2];
}
// Repro from #26409
var cf1 = function(t, k) {
    var s = t[k];
    t.cool;
};
var cf2 = function(t, k) {
    var s = t[k];
    t.cool;
};
