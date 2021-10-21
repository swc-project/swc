function _objectWithoutProperties(source, excluded) {
    if (null == source) return {
    };
    var key, i, target = _objectWithoutPropertiesLoose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], excluded.indexOf(key) >= 0 || Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (null == source) return {
    };
    var key, i, target = {
    }, sourceKeys = Object.keys(source);
    for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
    return target;
}
function foobar(_param = {
}) {
    var { bar ={
    }  } = _param;
    _objectWithoutProperties(_param, [
        "bar"
    ]);
}
suddenly((_param)=>{
    var { x: a  } = _param;
    return _objectWithoutProperties(_param, [
        "x"
    ]).y;
}), suddenly((_param = {
    x: {
        z: 1,
        ka: 1
    },
    y: "noo"
})=>{
    var { x: { z =12  }  } = _param, nested = _objectWithoutProperties(_param.x, [
        "z"
    ]), rest = _objectWithoutProperties(_param, [
        "x"
    ]);
    return rest.y + nested.ka;
}), foobar(), foobar({
    baz: "hello"
}), foobar({
    bar: {
        greeting: "hello"
    }
});
