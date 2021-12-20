function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
var _key;
// @strict: true
// @target: es6
class A {
    constructor(message){
        _foo.set(this, {
            writable: true,
            value: 3
        });
        this[_key] // Error (private identifiers should not prevent circularity checking for computeds)
         = this["#bar"];
        _classPrivateFieldSet(this, _f, 3 // Error (index signatures do not implicitly declare private names)
        );
        this["#foo"] = 3; // Okay (type has index signature and "#foo" does not collide with private identifier #foo)
    }
}
var _foo = new WeakMap();
_key = "#bar";
