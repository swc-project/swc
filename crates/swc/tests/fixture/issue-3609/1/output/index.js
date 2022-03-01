function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
let _ref = `lit${"lit"}`, _ref1 = `tpl${`tpl`}`, _ref2 = `lit${1 + 1}`, _ref3 = `complex${"123".length()}`;
class Foo {
    constructor(){
        _defineProperty(this, 1, 2);
        _defineProperty(this, "3", 4);
        _defineProperty(this, `5`, 6);
        _defineProperty(this, _ref, "lit");
        _defineProperty(this, _ref1, `tpl`);
        _defineProperty(this, _ref2, `lit`);
        _defineProperty(this, _ref3, `complex`);
    }
}
