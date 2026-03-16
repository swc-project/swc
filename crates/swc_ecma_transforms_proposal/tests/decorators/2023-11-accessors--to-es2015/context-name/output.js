var _init_a, _init_extra__init_a, _init_a1, _init_extra__init_a1, _get___a, _set___a, _computedKey, _init_computedKey, _init_extra__init_computedKey, _computedKey1, _init_computedKey1, _init_extra__init_computedKey1, _computedKey2, _init_computedKey2, _init_extra__init_computedKey2, _computedKey3, _init_computedKey3, _init_extra__init_computedKey3, _computedKey4, _init_computedKey4, _init_extra__init_computedKey4, _computedKey5, _init_computedKey5, _init_extra__init_computedKey5, _computedKey6, _init_computedKey6, _init_extra__init_computedKey6;
const logs = [];
const dec = (value, context)=>{
    logs.push(context.name);
};
const f = ()=>{
    logs.push("computing f");
    return {
        [Symbol.toPrimitive]: ()=>(logs.push("calling toPrimitive"), "f()")
    };
};
_computedKey = "b", _computedKey1 = "c", _computedKey2 = 0, _computedKey3 = 1, _computedKey4 = 2n, _computedKey5 = 3n, _computedKey6 = f();
let _computedKey7 = _computedKey, _computedKey8 = _computedKey, _computedKey9 = _computedKey1, _computedKey10 = _computedKey1, _computedKey11 = _computedKey2, _computedKey12 = _computedKey2, _computedKey13 = _computedKey3, _computedKey14 = _computedKey3, _computedKey15 = _computedKey4, _computedKey16 = _computedKey4, _computedKey17 = _computedKey5, _computedKey18 = _computedKey5, _computedKey19 = _computedKey6, _computedKey20 = _computedKey6;
class Foo {
    static get a() {
        return _class_static_private_field_spec_get(this, Foo, ____private_a_1);
    }
    static set a(_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_a_1, _v);
    }
    static get [_computedKey7]() {
        return _class_static_private_field_spec_get(this, Foo, ____private_computedKey_3);
    }
    static set [_computedKey8](_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_computedKey_3, _v);
    }
    static get [_computedKey9]() {
        return _class_static_private_field_spec_get(this, Foo, ____private_computedKey_4);
    }
    static set [_computedKey10](_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_computedKey_4, _v);
    }
    static get [_computedKey11]() {
        return _class_static_private_field_spec_get(this, Foo, ____private_computedKey_5);
    }
    static set [_computedKey12](_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_computedKey_5, _v);
    }
    static get [_computedKey13]() {
        return _class_static_private_field_spec_get(this, Foo, ____private_computedKey_6);
    }
    static set [_computedKey14](_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_computedKey_6, _v);
    }
    static get [_computedKey15]() {
        return _class_static_private_field_spec_get(this, Foo, ____private_computedKey_7);
    }
    static set [_computedKey16](_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_computedKey_7, _v);
    }
    static get [_computedKey17]() {
        return _class_static_private_field_spec_get(this, Foo, ____private_computedKey_8);
    }
    static set [_computedKey18](_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_computedKey_8, _v);
    }
    static get [_computedKey19]() {
        return _class_static_private_field_spec_get(this, Foo, ____private_computedKey_9);
    }
    static set [_computedKey20](_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_computedKey_9, _v);
    }
}
var _a = {
    get: get_a,
    set: set_a
};
({ e: [_init_a, _init_extra__init_a, _init_a1, _get___a, _set___a, _init_extra__init_a1, _init_computedKey, _init_extra__init_computedKey, _init_computedKey1, _init_extra__init_computedKey1, _init_computedKey2, _init_extra__init_computedKey2, _init_computedKey3, _init_extra__init_computedKey3, _init_computedKey4, _init_extra__init_computedKey4, _init_computedKey5, _init_extra__init_computedKey5, _init_computedKey6, _init_extra__init_computedKey6] } = _apply_decs_2311(Foo, [], [
    [
        dec,
        9,
        "a"
    ],
    [
        dec,
        9,
        "a",
        function(_this) {
            return _class_static_private_field_spec_get(_this, Foo, ___a_2);
        },
        function(_this, _v) {
            _class_static_private_field_spec_set(_this, Foo, ___a_2, _v);
        }
    ],
    [
        dec,
        9,
        _computedKey
    ],
    [
        dec,
        9,
        _computedKey1
    ],
    [
        dec,
        9,
        _computedKey2
    ],
    [
        dec,
        9,
        _computedKey3
    ],
    [
        dec,
        9,
        _computedKey4
    ],
    [
        dec,
        9,
        _computedKey5
    ],
    [
        dec,
        9,
        _computedKey6
    ]
]));
var ____private_a_1 = {
    writable: true,
    value: (()=>{
        const _value = _init_a();
        _init_extra__init_a();
        return _value;
    })()
};
var ___a_2 = {
    writable: true,
    value: (()=>{
        const _value = _init_a1();
        _init_extra__init_a1();
        return _value;
    })()
};
var ____private_computedKey_3 = {
    writable: true,
    value: (()=>{
        const _value = _init_computedKey();
        _init_extra__init_computedKey();
        return _value;
    })()
};
var ____private_computedKey_4 = {
    writable: true,
    value: (()=>{
        const _value = _init_computedKey1();
        _init_extra__init_computedKey1();
        return _value;
    })()
};
var ____private_computedKey_5 = {
    writable: true,
    value: (()=>{
        const _value = _init_computedKey2();
        _init_extra__init_computedKey2();
        return _value;
    })()
};
var ____private_computedKey_6 = {
    writable: true,
    value: (()=>{
        const _value = _init_computedKey3();
        _init_extra__init_computedKey3();
        return _value;
    })()
};
var ____private_computedKey_7 = {
    writable: true,
    value: (()=>{
        const _value = _init_computedKey4();
        _init_extra__init_computedKey4();
        return _value;
    })()
};
var ____private_computedKey_8 = {
    writable: true,
    value: (()=>{
        const _value = _init_computedKey5();
        _init_extra__init_computedKey5();
        return _value;
    })()
};
var ____private_computedKey_9 = {
    writable: true,
    value: (()=>{
        const _value = _init_computedKey6();
        _init_extra__init_computedKey6();
        return _value;
    })()
};
function get_a() {
    return _get___a();
}
function set_a(_v) {
    _set___a(_v);
}
expect(logs).toStrictEqual([
    "computing f",
    "calling toPrimitive",
    "a",
    "#a",
    "b",
    "c",
    "0",
    "1",
    "2",
    "3",
    "f()"
]);
