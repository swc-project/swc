var _init_a, _init_a1, _get___a, _set___a, _computedKey, _init_computedKey, _computedKey1, _init_computedKey1, _computedKey2, _init_computedKey2, _computedKey3, _init_computedKey3, _computedKey4, _init_computedKey4, _computedKey5, _init_computedKey5, _computedKey6, _init_computedKey6, _initStatic;
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
class Foo {
    static{
        ({ e: [_init_a, _init_a1, _get___a, _set___a, _init_computedKey, _init_computedKey1, _init_computedKey2, _init_computedKey3, _init_computedKey4, _init_computedKey5, _init_computedKey6, _initStatic] } = _apply_decs_2311(this, [], [
            [
                dec,
                9,
                "a"
            ],
            [
                dec,
                9,
                "a",
                function() {
                    return this.#__a_2;
                },
                function(_v) {
                    this.#__a_2 = _v;
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
        _initStatic(this);
    }
    static #___private_a_1 = _init_a(this);
    static get a() {
        return this.#___private_a_1;
    }
    static set a(_v) {
        this.#___private_a_1 = _v;
    }
    static #__a_2 = _init_a1(this);
    static get #a() {
        return _get___a(this);
    }
    static set #a(_v) {
        _set___a(this, _v);
    }
    static #___private_computedKey_3 = _init_computedKey(this);
    static get [_computedKey]() {
        return this.#___private_computedKey_3;
    }
    static set [_computedKey](_v) {
        this.#___private_computedKey_3 = _v;
    }
    static #___private_computedKey_4 = _init_computedKey1(this);
    static get [_computedKey1]() {
        return this.#___private_computedKey_4;
    }
    static set [_computedKey1](_v) {
        this.#___private_computedKey_4 = _v;
    }
    static #___private_computedKey_5 = _init_computedKey2(this);
    static get [_computedKey2]() {
        return this.#___private_computedKey_5;
    }
    static set [_computedKey2](_v) {
        this.#___private_computedKey_5 = _v;
    }
    static #___private_computedKey_6 = _init_computedKey3(this);
    static get [_computedKey3]() {
        return this.#___private_computedKey_6;
    }
    static set [_computedKey3](_v) {
        this.#___private_computedKey_6 = _v;
    }
    static #___private_computedKey_7 = _init_computedKey4(this);
    static get [_computedKey4]() {
        return this.#___private_computedKey_7;
    }
    static set [_computedKey4](_v) {
        this.#___private_computedKey_7 = _v;
    }
    static #___private_computedKey_8 = _init_computedKey5(this);
    static get [_computedKey5]() {
        return this.#___private_computedKey_8;
    }
    static set [_computedKey5](_v) {
        this.#___private_computedKey_8 = _v;
    }
    static #___private_computedKey_9 = _init_computedKey6(this);
    static get [_computedKey6]() {
        return this.#___private_computedKey_9;
    }
    static set [_computedKey6](_v) {
        this.#___private_computedKey_9 = _v;
    }
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
