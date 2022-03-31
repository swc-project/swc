function getProps(obj, list) {
    return {};
}
applySpec({
    sum: function(a) {
        return 3;
    },
    nested: {
        mul: function(b) {
            return "n";
        }
    }
}), applySpec({
    foo: {
        bar: {
            baz: function(x) {
                return !0;
            }
        }
    }
}), f20({
    foo: 42,
    bar: "hello"
}), f21({
    foo: 42,
    bar: "hello"
}), f22({
    foo: {
        value: 42
    },
    bar: {
        value: "hello"
    }
}), f23({
    foo: 42,
    bar: "hello"
}), f24({
    foo: 42,
    bar: "hello"
});
var myAny = {};
getProps(myAny, [
    "foo",
    "bar"
]), getProps(myAny, [
    "foo",
    "bar"
]);
