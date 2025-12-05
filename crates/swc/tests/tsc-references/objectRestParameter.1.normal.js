//// [objectRestParameter.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
function cloneAgain(_0) {
    let { a } = _0, clone = _object_without_properties(_0, [
        "a"
    ]);
}
suddenly((_0)=>{
    let { x: a } = _0, rest = _object_without_properties(_0, [
        "x"
    ]);
    return rest.y;
});
suddenly((_0 = void 0)=>{
    let _ref = [
        _0
    ], [_ref1 = {
        x: {
            z: 1,
            ka: 1
        },
        y: 'noo'
    }] = _ref, { x: _ref2 } = _ref1, { z = 12 } = _ref2, nested = _object_without_properties(_ref2, [
        "z"
    ]), rest = _object_without_properties(_ref1, [
        "x"
    ]);
    return rest.y + nested.ka;
});
class C {
    m(_0) {
        let { a } = _0, clone = _object_without_properties(_0, [
            "a"
        ]);
    // actually, never mind, don't clone
    }
    set p(_0) {
        let { a } = _0, clone = _object_without_properties(_0, [
            "a"
        ]);
    // actually, never mind, don't clone
    }
}
function foobar(_0 = void 0) {
    let _ref = [
        _0
    ], [_ref1 = {}] = _ref, { bar = {} } = _ref1, opts = _object_without_properties(_ref1, [
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
