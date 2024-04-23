//// [isomorphicMappedTypeInference.ts]
function box(x) {
    return {
        value: x
    };
}
function unbox(x) {
    return x.value;
}
function boxify(obj) {
    var result = {};
    for(var k in obj){
        result[k] = box(obj[k]);
    }
    return result;
}
function unboxify(obj) {
    var result = {};
    for(var k in obj){
        result[k] = unbox(obj[k]);
    }
    return result;
}
function assignBoxified(obj, values) {
    for(var k in values){
        obj[k].value = values[k];
    }
}
function f1() {
    var v = {
        a: 42,
        b: "hello",
        c: true
    };
    var b = boxify(v);
    var x = b.a.value;
}
function f2() {
    var b = {
        a: box(42),
        b: box("hello"),
        c: box(true)
    };
    var v = unboxify(b);
    var x = v.a;
}
function f3() {
    var b = {
        a: box(42),
        b: box("hello"),
        c: box(true)
    };
    assignBoxified(b, {
        c: false
    });
}
function f4() {
    var b = {
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
    var b = makeRecord({
        a: box(42),
        b: box("hello"),
        c: box(true)
    });
    var v = unboxify(b);
    var x = v.a;
}
function makeDictionary(obj) {
    return obj;
}
function f6(s) {
    var b = makeDictionary({
        a: box(42),
        b: box("hello"),
        c: box(true)
    });
    var v = unboxify(b);
    var x = v[s];
}
function f10(foo) {
    var x = validate(foo); // { a: number, readonly b: string }
    var y = clone(foo); // { a?: number, b: string }
    var z = validateAndClone(foo); // { a: number, b: string }
}
// Infers g1: (...args: any[]) => { sum: number, nested: { mul: string } }
var g1 = applySpec({
    sum: function(a) {
        return 3;
    },
    nested: {
        mul: function(b) {
            return "n";
        }
    }
});
// Infers g2: (...args: any[]) => { foo: { bar: { baz: boolean } } }
var g2 = applySpec({
    foo: {
        bar: {
            baz: function(x) {
                return true;
            }
        }
    }
});
// Repro from #12633
var foo = function(object, partial) {
    return object;
};
var o = {
    a: 5,
    b: 7
};
foo(o, {
    b: 9
});
o = foo(o, {
    b: 9
});
var x0 = f20({
    foo: 42,
    bar: "hello"
});
var x1 = f21({
    foo: 42,
    bar: "hello"
});
var x2 = f22({
    foo: {
        value: 42
    },
    bar: {
        value: "hello"
    }
});
var x3 = f23({
    foo: 42,
    bar: "hello"
});
var x4 = f24({
    foo: 42,
    bar: "hello"
});
// Repro from #29765
function getProps(obj, list) {
    return {};
}
var myAny = {};
var o1 = getProps(myAny, [
    'foo',
    'bar'
]);
var o2 = getProps(myAny, [
    'foo',
    'bar'
]);
