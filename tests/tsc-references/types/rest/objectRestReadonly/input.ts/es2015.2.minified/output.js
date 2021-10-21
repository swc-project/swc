const obj = {
    foo: "bar",
    baz: "qux",
    quux: "quuz"
}, { foo  } = obj, rest = function(source, excluded) {
    if (null == source) return {
    };
    var key, i, target = function(source, excluded) {
        if (null == source) return {
        };
        var key, i, target = {
        }, sourceKeys = Object.keys(source);
        for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
        return target;
    }(source, excluded);
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
    }
    return target;
}(obj, [
    "foo"
]);
delete rest.baz;
