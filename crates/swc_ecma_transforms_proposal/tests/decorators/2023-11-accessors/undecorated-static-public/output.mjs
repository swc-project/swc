let _computedKey, _computedKey1, _computedKey2;
const dec = ()=>{};
_computedKey = _to_property_key('c');
class Foo {
    static #___private_a_1;
    static get a() {
        return Foo.#___private_a_1;
    }
    static set a(_v) {
        Foo.#___private_a_1 = _v;
    }
    static #___private_b_2 = 123;
    static get b() {
        return Foo.#___private_b_2;
    }
    static set b(_v) {
        Foo.#___private_b_2 = _v;
    }
    static #___private__computedKey_3 = 456;
    static get [_computedKey]() {
        return Foo.#___private__computedKey_3;
    }
    static set [_computedKey](_v) {
        Foo.#___private__computedKey_3 = _v;
    }
}
_computedKey1 = _to_property_key('c');
Foo = class {
    static #___private_a_4;
    static get a() {
        return this.#___private_a_4;
    }
    static set a(_v) {
        this.#___private_a_4 = _v;
    }
    static #___private_b_5 = 123;
    static get b() {
        return this.#___private_b_5;
    }
    static set b(_v) {
        this.#___private_b_5 = _v;
    }
    static #___private__computedKey_6 = 456;
    static get [_computedKey1]() {
        return this.#___private__computedKey_6;
    }
    static set [_computedKey1](_v) {
        this.#___private__computedKey_6 = _v;
    }
};
_computedKey2 = _to_property_key('c');
export default class {
    static #___private_a_7;
    static get a() {
        return this.#___private_a_7;
    }
    static set a(_v) {
        this.#___private_a_7 = _v;
    }
    static #___private_b_8 = 123;
    static get b() {
        return this.#___private_b_8;
    }
    static set b(_v) {
        this.#___private_b_8 = _v;
    }
    static #___private__computedKey_9 = 456;
    static get [_computedKey2]() {
        return this.#___private__computedKey_9;
    }
    static set [_computedKey2](_v) {
        this.#___private__computedKey_9 = _v;
    }
}
