function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _Foo, __, __1, __2;
var _class;
// https://github.com/microsoft/TypeScript/issues/44872
void (_class = (_Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
}, __ = {
    writable: true,
    value: function() {
        console.log(_Foo.prop);
        _Foo.prop++;
    }()
}, __1 = {
    writable: true,
    value: function() {
        console.log(_Foo.prop);
        _Foo.prop++;
    }()
}, __2 = {
    writable: true,
    value: function() {
        console.log(_Foo.prop);
        _Foo.prop++;
    }()
}, _Foo), _class.prop = 1, _class);
