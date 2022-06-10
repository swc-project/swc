// @strictNullChecks: true
// @declaration: true
class Shape {
}
class TaggedShape extends Shape {
}
class Item {
}
class Options {
}
var E;
(function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    E[E["C"] = 2] = "C";
})(E || (E = {}));
function getProperty(obj, key) {
    return obj[key];
}
function setProperty(obj, key, value) {
    obj[key] = value;
}
function f10(shape) {
    let name = getProperty(shape, "name"); // string
    let widthOrHeight = getProperty(shape, cond ? "width" : "height"); // number
    let nameOrVisible = getProperty(shape, cond ? "name" : "visible"); // string | boolean
    setProperty(shape, "name", "rectangle");
    setProperty(shape, cond ? "width" : "height", 10);
    setProperty(shape, cond ? "name" : "visible", true); // Technically not safe
}
function f11(a) {
    let len = getProperty(a, "length"); // number
    setProperty(a, "length", len);
}
function f12(t) {
    let len = getProperty(t, "length");
    let s2 = getProperty(t, "0"); // Shape
    let b2 = getProperty(t, "1"); // boolean
}
function f13(foo, bar) {
    let x = getProperty(foo, "x"); // any
    let y = getProperty(foo, "100"); // any
    let z = getProperty(foo, bar); // any
}
class Component {
    getProperty(key) {
        return this.props[key];
    }
    setProperty(key, value) {
        this.props[key] = value;
    }
}
function f20(component) {
    let name = component.getProperty("name"); // string
    let widthOrHeight = component.getProperty(cond ? "width" : "height"); // number
    let nameOrVisible = component.getProperty(cond ? "name" : "visible"); // string | boolean
    component.setProperty("name", "rectangle");
    component.setProperty(cond ? "width" : "height", 10);
    component.setProperty(cond ? "name" : "visible", true); // Technically not safe
}
function pluck(array, key) {
    return array.map((x)=>x[key]);
}
function f30(shapes) {
    let names = pluck(shapes, "name"); // string[]
    let widths = pluck(shapes, "width"); // number[]
    let nameOrVisibles = pluck(shapes, cond ? "name" : "visible"); // (string | boolean)[]
}
function f31(key) {
    const shape = {
        name: "foo",
        width: 5,
        height: 10,
        visible: true
    };
    return shape[key]; // Shape[K]
}
function f32(key) {
    const shape = {
        name: "foo",
        width: 5,
        height: 10,
        visible: true
    };
    return shape[key]; // Shape[K]
}
function f33(shape, key) {
    let name = getProperty(shape, "name");
    let prop = getProperty(shape, key);
    return prop;
}
function f34(ts) {
    let tag1 = f33(ts, "tag");
    let tag2 = getProperty(ts, "tag");
}
class C {
}
// Indexed access expressions have always permitted access to private and protected members.
// For consistency we also permit such access in indexed access types.
function f40(c) {
    let x = c["x"];
    let y = c["y"];
    let z = c["z"];
}
function f50(k, s) {
    const x1 = s;
    const x2 = k;
}
function f51(k, s) {
    const x1 = s;
    const x2 = k;
}
function f52(obj, k, s, n) {
    const x1 = obj[s];
    const x2 = obj[n];
    const x3 = obj[k];
}
function f53(obj, k, s, n) {
    const x1 = obj[s];
    const x2 = obj[n];
    const x3 = obj[k];
}
function f54(obj, key) {
    for(let s in obj[key]){}
    const b = "foo" in obj[key];
}
function f55(obj, key) {
    for(let s in obj[key]){}
    const b = "foo" in obj[key];
}
function f60(source, target) {
    for(let k in source){
        target[k] = source[k];
    }
}
function f70(func) {
    func('a', 'a');
    func('a', 'b');
    func('a', 'c');
}
function f71(func) {
    let x = func({
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
    let a = func({
        a: 1,
        b: "hello"
    }, {
        c: true
    }, 'a'); // number
    let b = func({
        a: 1,
        b: "hello"
    }, {
        c: true
    }, 'b'); // string
    let c = func({
        a: 1,
        b: "hello"
    }, {
        c: true
    }, 'c'); // boolean
}
function f73(func) {
    let a = func({
        a: 1,
        b: "hello"
    }, {
        c: true
    }, 'a'); // number
    let b = func({
        a: 1,
        b: "hello"
    }, {
        c: true
    }, 'b'); // string
    let c = func({
        a: 1,
        b: "hello"
    }, {
        c: true
    }, 'c'); // boolean
}
function f74(func) {
    let a = func({
        a: 1,
        b: "hello"
    }, {
        a: 2,
        b: true
    }, 'a'); // number
    let b = func({
        a: 1,
        b: "hello"
    }, {
        a: 2,
        b: true
    }, 'b'); // string | boolean
}
function f80(obj) {
    let a1 = obj.a; // { x: any }
    let a2 = obj['a']; // { x: any }
    let a3 = obj['a']; // T["a"]
    let x1 = obj.a.x; // any
    let x2 = obj['a']['x']; // any
    let x3 = obj['a']['x']; // T["a"]["x"]
}
function f81(obj) {
    return obj['a']['x'];
}
function f82() {
    let x1 = f81({
        a: {
            x: "hello"
        }
    }); // string
    let x2 = f81({
        a: {
            x: 42
        }
    }); // number
}
function f83(obj, key) {
    return obj[key]['x'];
}
function f84() {
    let x1 = f83({
        foo: {
            x: "hello"
        }
    }, "foo"); // string
    let x2 = f83({
        bar: {
            x: 42
        }
    }, "bar"); // number
}
class C1 {
    get(key) {
        return this[key];
    }
    set(key, value) {
        this[key] = value;
    }
    foo() {
        let x1 = this.x; // number
        let x2 = this["x"]; // number
        let x3 = this.get("x"); // this["x"]
        let x4 = getProperty(this, "x"); // this["x"]
        this.x = 42;
        this["x"] = 42;
        this.set("x", 42);
        setProperty(this, "x", 42);
    }
}
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
    let a;
    a = x;
    a = y;
    a = z;
}
function f92(x, y, z) {
    let a;
    a = x;
    a = y;
    a = z;
}
// Repros from #12011
class Base {
    get(prop) {
        return this[prop];
    }
    set(prop, value) {
        this[prop] = value;
    }
}
class Person extends Base {
    getParts() {
        return this.get("parts");
    }
    constructor(parts){
        super();
        this.set("parts", parts);
    }
}
class OtherPerson {
    getParts() {
        return getProperty(this, "parts");
    }
    constructor(parts){
        setProperty(this, "parts", parts);
    }
}
function path(obj, ...keys) {
    let result1 = obj;
    for (let k of keys){
        result1 = result1[k];
    }
    return result1;
}
function f1(thing) {
    let x1 = path(thing, 'a'); // { x: number, y: string }
    let x2 = path(thing, 'a', 'y'); // string
    let x3 = path(thing, 'b'); // boolean
    let x4 = path(thing, ...[
        'a',
        'x'
    ]); // any
}
// Repro from comment in #12114
const assignTo2 = (object, key1, key2)=>(value)=>object[key1][key2] = value;
var empty = one(()=>{}) // inferred as {}, expected
;
var hashOfEmpty1 = on({
    test: ()=>{}
}); // {}
var hashOfEmpty2 = on({
    test: (x)=>{}
}); // { test: boolean }
let c1 = new Component1({
    data: {
        hello: ""
    }
});
c1.get("hello");
function f(p) {
    let a;
    a[p].add; // any
}
let result = dispatchMethod("someMethod", [
    "hello",
    35
]);
let MyThingy;
function addToMyThingy(key) {
    MyThingy[key].push("a");
}
function onChangeGenericFunction(handler) {
    handler.onChange('preset');
}
// Repro from #13285
function updateIds(obj, idFields, idMapping) {
    for (const idField of idFields){
        const newId = idMapping[obj[idField]];
        if (newId) {
            obj[idField] = newId;
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
class A {
}
class B extends A {
    f(p) {
        p.x;
    }
}
// Repro from #13749
class Form {
    set(prop, value) {
        this.childFormFactories[prop](value);
    }
}
// Repro from #13787
class SampleClass {
    constructor(props){
        this.props = Object.freeze(props);
    }
}
class AnotherSampleClass extends SampleClass {
    brokenMethod() {
        this.props.foo.concat;
    }
    constructor(props){
        const foo = {
            foo: "bar"
        };
        super(merge(props, foo));
    }
}
new AnotherSampleClass({});
// Positive repro from #17166
function f3(t, k, tk) {
    for(let key in t){
        key = k // ok, K ==> keyof T
        ;
        t[key] = tk; // ok, T[K] ==> T[keyof T]
    }
}
var Flag;
(function(Flag) {
    Flag["FLAG_1"] = "flag_1";
    Flag["FLAG_2"] = "flag_2";
})(Flag || (Flag = {}));
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
class Unbounded {
    foo(x) {
        let y = x;
    }
}
function ff1(dd, k1, k2) {
    return dd[k1][k2];
}
function ff2(dd, k1, k2) {
    const d = dd[k1];
    return d[k2];
}
// Repro from #26409
const cf1 = (t, k)=>{
    const s = t[k];
    t.cool;
};
const cf2 = (t, k)=>{
    const s = t[k];
    t.cool;
};
