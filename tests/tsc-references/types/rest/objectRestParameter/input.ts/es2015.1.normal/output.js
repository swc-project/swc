function _objectWithoutProperties(source, excluded) {
    if (source == null) return {
    };
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {
    };
    var target = {
    };
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
// @target: es2015
function cloneAgain(_param) {
    var { a  } = _param, clone = _objectWithoutProperties(_param, [
        "a"
    ]);
}
suddenly((_param)=>{
    var { x: a  } = _param, rest = _objectWithoutProperties(_param, [
        "x"
    ]);
    return rest.y;
});
suddenly((_param = {
    x: {
        z: 1,
        ka: 1
    },
    y: 'noo'
})=>{
    var { x: { z =12  }  } = _param, nested = _objectWithoutProperties(_param.x, [
        "z"
    ]), rest = _objectWithoutProperties(_param, [
        "x"
    ]);
    return rest.y + nested.ka;
});
class C {
    m(_param2) {
        var { a  } = _param2, clone = _objectWithoutProperties(_param2, [
            "a"
        ]);
    // actually, never mind, don't clone
    }
    set p(_param1) {
        var { a  } = _param1, clone = _objectWithoutProperties(_param1, [
            "a"
        ]);
    // actually, never mind, don't clone
    }
}
function foobar(_param = {
}) {
    var { bar ={
    }  } = _param, opts = _objectWithoutProperties(_param, [
        "bar"
    ]);
}
foobar();
foobar({
    baz: 'hello'
});
foobar({
    bar: {
        greeting: 'hello'
    }
});
