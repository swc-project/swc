const foo = "foo";
const bar = ()=>{};
const four = 4;
let _one = one(), _ref = 2 * 4 + 7, _ref1 = 2 * four + 7, _ref2 = 2 * four + seven, _undefined = undefined, _ref3 = void 0, _computed = computed(), _computed1 = computed(), _tmp = "test" + one, _ref4 = /regex/, _foo = foo, _bar = bar, _baz = baz, _ref5 = `template${expression}`;
class MyClass {
    get ["whatever"]() {}
    set ["whatever"](value) {}
    get [_computed]() {}
    set [_computed1](value) {}
    [_tmp]() {}
    static [10]() {}
    constructor(){
        this[null] = "null";
        this[_undefined] = "undefined";
        this[_ref3] = "void 0";
        this[_ref4] = "regex";
        this[_foo] = "foo";
        this[_bar] = "bar";
        this[_baz] = "baz";
        this[`template`] = "template";
        this[_ref5] = "template-with-expression";
    }
}
MyClass[_one] = "test";
MyClass[_ref] = "247";
MyClass[_ref1] = "247";
MyClass[_ref2] = "247";
