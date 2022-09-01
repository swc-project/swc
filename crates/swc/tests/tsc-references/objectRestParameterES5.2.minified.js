//// [objectRestParameterES5.ts]
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
function foobar() {
    var _param = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    _param.bar, _object_without_properties(_param, [
        "bar"
    ]);
}
suddenly(function(_param) {
    return _param.x, _object_without_properties(_param, [
        "x"
    ]).y;
}), suddenly(function() {
    var _param = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: {
            z: 1,
            ka: 1
        },
        y: "noo"
    }, nested = (_param.x.z, _object_without_properties(_param.x, [
        "z"
    ]));
    return _object_without_properties(_param, [
        "x"
    ]).y + nested.ka;
}), foobar(), foobar({
    baz: "hello"
}), foobar({
    bar: {
        greeting: "hello"
    }
});
