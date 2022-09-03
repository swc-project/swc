//// [objectRestParameter.ts]
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
function cloneAgain(_param) {
    var { a  } = _param;
    _object_without_properties(_param, [
        "a"
    ]);
}
suddenly((_param)=>{
    var rest, { x: a  } = _param;
    return _object_without_properties(_param, [
        "x"
    ]).y;
}), suddenly((_param = {
    x: {
        z: 1,
        ka: 1
    },
    y: 'noo'
})=>{
    var rest, { x: { z =12  }  } = _param, nested = _object_without_properties(_param.x, [
        "z"
    ]);
    return _object_without_properties(_param, [
        "x"
    ]).y + nested.ka;
});
class C {
    m(_param) {
        var { a  } = _param;
        _object_without_properties(_param, [
            "a"
        ]);
    }
    set p(_param) {
        var { a  } = _param;
        _object_without_properties(_param, [
            "a"
        ]);
    }
}
function foobar(_param = {}) {
    var { bar ={}  } = _param;
    _object_without_properties(_param, [
        "bar"
    ]);
}
foobar(), foobar({
    baz: 'hello'
}), foobar({
    bar: {
        greeting: 'hello'
    }
});
