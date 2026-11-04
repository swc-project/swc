_object_spread_props(_object_spread(_object_spread_props(_object_spread({
    x
}, y), {
    a
}), b), {
    c
});
_object_spread({}, Object.prototype);
_object_spread({}, {
    foo: 'bar'
});
_object_spread({}, {
    get foo () {
        return 'foo';
    }
});
