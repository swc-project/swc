import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
function foobar(_param = {}) {
    var { bar ={}  } = _param;
    _object_without_properties(_param, [
        "bar"
    ]);
}
suddenly((_param)=>{
    var { x: a  } = _param;
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
    var { x: { z =12  }  } = _param, nested = _object_without_properties(_param.x, [
        "z"
    ]), rest = _object_without_properties(_param, [
        "x"
    ]);
    return rest.y + nested.ka;
}), foobar(), foobar({
    baz: 'hello'
}), foobar({
    bar: {
        greeting: 'hello'
    }
});
