import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
// @target: es5
function cloneAgain(_param) {
    var { a  } = _param, clone = _object_without_properties(_param, [
        "a"
    ]);
}
suddenly((_param)=>{
    var { x: a  } = _param, rest = _object_without_properties(_param, [
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
    var { x: { z =12  }  } = _param, nested = _object_without_properties(_param.x, [
        "z"
    ]), rest = _object_without_properties(_param, [
        "x"
    ]);
    return rest.y + nested.ka;
});
class C {
    m(_param) {
        var { a  } = _param, clone = _object_without_properties(_param, [
            "a"
        ]);
    // actually, never mind, don't clone
    }
    set p(_param) {
        var { a  } = _param, clone = _object_without_properties(_param, [
            "a"
        ]);
    // actually, never mind, don't clone
    }
}
function foobar(_param = {}) {
    var { bar ={}  } = _param, opts = _object_without_properties(_param, [
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
