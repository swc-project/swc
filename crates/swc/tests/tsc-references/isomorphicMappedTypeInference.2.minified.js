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
    for(var k in obj)result[k] = box(obj[k]);
    return result;
}
function unboxify(obj) {
    var result = {};
    for(var k in obj)result[k] = unbox(obj[k]);
    return result;
}
function assignBoxified(obj, values) {
    for(var k in values)obj[k].value = values[k];
}
function f1() {
    boxify({
        a: 42,
        b: "hello",
        c: !0
    }).a.value;
}
function f2() {
    unboxify({
        a: box(42),
        b: box("hello"),
        c: box(!0)
    }).a;
}
function f3() {
    assignBoxified({
        a: box(42),
        b: box("hello"),
        c: box(!0)
    }, {
        c: !1
    });
}
function f4() {
    var b = {
        a: box(42),
        b: box("hello"),
        c: box(!0)
    };
    b = boxify(unboxify(b)), b = unboxify(boxify(b));
}
function makeRecord(obj) {
    return obj;
}
function f5(s) {
    unboxify(makeRecord({
        a: box(42),
        b: box("hello"),
        c: box(!0)
    })).a;
}
function makeDictionary(obj) {
    return obj;
}
function f6(s) {
    unboxify(makeDictionary({
        a: box(42),
        b: box("hello"),
        c: box(!0)
    }))[s];
}
function f10(foo) {
    validate(foo), clone(foo), validateAndClone(foo);
}
var g1 = applySpec({
    sum: function(a) {
        return 3;
    },
    nested: {
        mul: function(b) {
            return "n";
        }
    }
}), g2 = applySpec({
    foo: {
        bar: {
            baz: function(x) {
                return !0;
            }
        }
    }
}), foo = function(object, partial) {
    return object;
}, o = {
    a: 5,
    b: 7
};
foo(o, {
    b: 9
}), o = foo(o, {
    b: 9
});
var x0 = f20({
    foo: 42,
    bar: "hello"
}), x1 = f21({
    foo: 42,
    bar: "hello"
}), x2 = f22({
    foo: {
        value: 42
    },
    bar: {
        value: "hello"
    }
}), x3 = f23({
    foo: 42,
    bar: "hello"
}), x4 = f24({
    foo: 42,
    bar: "hello"
});
function getProps(obj, list) {
    return {};
}
var myAny = {}, o1 = getProps(myAny, [
    "foo",
    "bar"
]), o2 = getProps(myAny, [
    "foo",
    "bar"
]);
