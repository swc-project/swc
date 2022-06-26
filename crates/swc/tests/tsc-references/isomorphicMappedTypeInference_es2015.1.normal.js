function box(x) {
    return {
        value: x
    };
}
function unbox(x) {
    return x.value;
}
function boxify(obj) {
    let result = {};
    for(let k in obj){
        result[k] = box(obj[k]);
    }
    return result;
}
function unboxify(obj) {
    let result = {};
    for(let k in obj){
        result[k] = unbox(obj[k]);
    }
    return result;
}
function assignBoxified(obj, values) {
    for(let k in values){
        obj[k].value = values[k];
    }
}
function f1() {
    let v = {
        a: 42,
        b: "hello",
        c: true
    };
    let b = boxify(v);
    let x = b.a.value;
}
function f2() {
    let b = {
        a: box(42),
        b: box("hello"),
        c: box(true)
    };
    let v = unboxify(b);
    let x = v.a;
}
function f3() {
    let b = {
        a: box(42),
        b: box("hello"),
        c: box(true)
    };
    assignBoxified(b, {
        c: false
    });
}
function f4() {
    let b = {
        a: box(42),
        b: box("hello"),
        c: box(true)
    };
    b = boxify(unboxify(b));
    b = unboxify(boxify(b));
}
function makeRecord(obj) {
    return obj;
}
function f5(s) {
    let b = makeRecord({
        a: box(42),
        b: box("hello"),
        c: box(true)
    });
    let v = unboxify(b);
    let x = v.a;
}
function makeDictionary(obj) {
    return obj;
}
function f6(s) {
    let b = makeDictionary({
        a: box(42),
        b: box("hello"),
        c: box(true)
    });
    let v = unboxify(b);
    let x = v[s];
}
function f10(foo) {
    let x = validate(foo); // { a: number, readonly b: string }
    let y = clone(foo); // { a?: number, b: string }
    let z = validateAndClone(foo); // { a: number, b: string }
}
// Infers g1: (...args: any[]) => { sum: number, nested: { mul: string } }
var g1 = applySpec({
    sum: (a)=>3,
    nested: {
        mul: (b)=>"n"
    }
});
// Infers g2: (...args: any[]) => { foo: { bar: { baz: boolean } } }
var g2 = applySpec({
    foo: {
        bar: {
            baz: (x)=>true
        }
    }
});
// Repro from #12633
const foo = (object, partial)=>object;
let o = {
    a: 5,
    b: 7
};
foo(o, {
    b: 9
});
o = foo(o, {
    b: 9
});
let x0 = f20({
    foo: 42,
    bar: "hello"
});
let x1 = f21({
    foo: 42,
    bar: "hello"
});
let x2 = f22({
    foo: {
        value: 42
    },
    bar: {
        value: "hello"
    }
});
let x3 = f23({
    foo: 42,
    bar: "hello"
});
let x4 = f24({
    foo: 42,
    bar: "hello"
});
// Repro from #29765
function getProps(obj, list) {
    return {};
}
const myAny = {};
const o1 = getProps(myAny, [
    'foo',
    'bar'
]);
const o2 = getProps(myAny, [
    'foo',
    'bar'
]);
