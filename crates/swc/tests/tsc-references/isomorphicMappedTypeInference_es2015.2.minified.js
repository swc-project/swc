function getProps(obj, list) {
    return {};
}
applySpec({
    sum: (a)=>3,
    nested: {
        mul: (b)=>"n"
    }
}), applySpec({
    foo: {
        bar: {
            baz: (x)=>!0
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
const myAny = {};
getProps(myAny, [
    'foo',
    'bar'
]), getProps(myAny, [
    'foo',
    'bar'
]);
