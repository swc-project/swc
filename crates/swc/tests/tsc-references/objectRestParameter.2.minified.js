//// [objectRestParameter.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
function foobar(_0) {
    let [_ref1 = {}] = [
        _0
    ], { bar = {} } = _ref1;
    _object_without_properties(_ref1, [
        "bar"
    ]);
}
suddenly((_0)=>{
    let { x: a } = _0;
    return _object_without_properties(_0, [
        "x"
    ]).y;
}), suddenly((_0)=>{
    let [_ref1 = {
        x: {
            z: 1,
            ka: 1
        },
        y: 'noo'
    }] = [
        _0
    ], { x: _ref2 } = _ref1, { z = 12 } = _ref2, nested = _object_without_properties(_ref2, [
        "z"
    ]);
    return _object_without_properties(_ref1, [
        "x"
    ]).y + nested.ka;
}), foobar(), foobar({
    baz: 'hello'
}), foobar({
    bar: {
        greeting: 'hello'
    }
});
