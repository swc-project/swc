function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
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
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
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
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
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
var Shape = function Shape() {
    "use strict";
    _classCallCheck(this, Shape);
};
var TaggedShape = /*#__PURE__*/ function(Shape) {
    "use strict";
    _inherits(TaggedShape, Shape);
    var _super = _createSuper(TaggedShape);
    function TaggedShape() {
        _classCallCheck(this, TaggedShape);
        return _super.apply(this, arguments);
    }
    return TaggedShape;
}(Shape);
var Item = function Item() {
    "use strict";
    _classCallCheck(this, Item);
};
var Options = function Options() {
    "use strict";
    _classCallCheck(this, Options);
};
var E1;
(function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    E[E["C"] = 2] = "C";
})(E1 || (E1 = {
}));
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
        _classCallCheck(this, Component);
    }
    _createClass(Component, [
        {
            key: "getProperty",
            value: function getProperty(key) {
                return this.props[key];
            }
        },
        {
            key: "setProperty",
            value: function setProperty(key, value) {
                this.props[key] = value;
            }
        }
    ]);
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
    _classCallCheck(this, C);
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
    for(var s in obj[key]){
    }
    var b = "foo" in obj[key];
}
function f55(obj, key) {
    for(var s in obj[key]){
    }
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
        _classCallCheck(this, C1);
    }
    _createClass(C1, [
        {
            key: "get",
            value: function get(key) {
                return this[key];
            }
        },
        {
            key: "set",
            value: function set(key, value) {
                this[key] = value;
            }
        },
        {
            key: "foo",
            value: function foo() {
                var x1 = this.x; // number
                var x2 = this["x"]; // number
                var x3 = this.get("x"); // this["x"]
                var x4 = getProperty(this, "x"); // this["x"]
                this.x = 42;
                this["x"] = 42;
                this.set("x", 42);
                setProperty(this, "x", 42);
            }
        }
    ]);
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
var Base = // Repros from #12011
/*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _classCallCheck(this, Base);
    }
    _createClass(Base, [
        {
            key: "get",
            value: function get(prop) {
                return this[prop];
            }
        },
        {
            key: "set",
            value: function set(prop, value) {
                this[prop] = value;
            }
        }
    ]);
    return Base;
}();
var Person = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Person, Base);
    var _super = _createSuper(Person);
    function Person(parts) {
        _classCallCheck(this, Person);
        var _this;
        _this = _super.call(this);
        _this.set("parts", parts);
        return _this;
    }
    _createClass(Person, [
        {
            key: "getParts",
            value: function getParts() {
                return this.get("parts");
            }
        }
    ]);
    return Person;
}(Base);
var OtherPerson = /*#__PURE__*/ function() {
    "use strict";
    function OtherPerson(parts) {
        _classCallCheck(this, OtherPerson);
        setProperty(this, "parts", parts);
    }
    _createClass(OtherPerson, [
        {
            key: "getParts",
            value: function getParts() {
                return getProperty(this, "parts");
            }
        }
    ]);
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
        thing
    ].concat(_toConsumableArray([
        'a',
        'x'
    ]))); // any
}
// Repro from comment in #12114
var assignTo2 = function(object, key1, key2) {
    return function(value) {
        return object[key1][key2] = value;
    };
};
var empty = one(function() {
}) // inferred as {}, expected
;
var hashOfEmpty1 = on({
    test: function() {
    }
}); // {}
var hashOfEmpty2 = on({
    test: function(x) {
    }
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
var result1 = dispatchMethod("someMethod", [
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
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _createSuper(B);
    function B() {
        _classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    _createClass(B, [
        {
            key: "f",
            value: function f(p) {
                p.x;
            }
        }
    ]);
    return B;
}(A);
var Form = // Repro from #13749
/*#__PURE__*/ function() {
    "use strict";
    function Form() {
        _classCallCheck(this, Form);
    }
    _createClass(Form, [
        {
            key: "set",
            value: function set(prop, value) {
                this.childFormFactories[prop](value);
            }
        }
    ]);
    return Form;
}();
var SampleClass = function SampleClass(props) {
    "use strict";
    _classCallCheck(this, SampleClass);
    this.props = Object.freeze(props);
};
var AnotherSampleClass = /*#__PURE__*/ function(SampleClass) {
    "use strict";
    _inherits(AnotherSampleClass, SampleClass);
    var _super = _createSuper(AnotherSampleClass);
    function AnotherSampleClass(props) {
        _classCallCheck(this, AnotherSampleClass);
        var foo = {
            foo: "bar"
        };
        return _super.call(this, merge(props, foo));
    }
    _createClass(AnotherSampleClass, [
        {
            key: "brokenMethod",
            value: function brokenMethod() {
                this.props.foo.concat;
            }
        }
    ]);
    return AnotherSampleClass;
}(SampleClass);
new AnotherSampleClass({
});
// Positive repro from #17166
function f3(t, k, tk) {
    for(var key in t){
        key = k // ok, K ==> keyof T
        ;
        t[key] = tk; // ok, T[K] ==> T[keyof T]
    }
}
var Flag1;
(function(Flag) {
    Flag["FLAG_1"] = "flag_1";
    Flag["FLAG_2"] = "flag_2";
})(Flag1 || (Flag1 = {
}));
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
var Unbounded = // Repro from #23133
/*#__PURE__*/ function() {
    "use strict";
    function Unbounded() {
        _classCallCheck(this, Unbounded);
    }
    _createClass(Unbounded, [
        {
            key: "foo",
            value: function foo(x) {
                var y = x;
            }
        }
    ]);
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
