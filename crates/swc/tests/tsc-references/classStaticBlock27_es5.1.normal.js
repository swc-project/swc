import * as swcHelpers from "@swc/helpers";
var _Foo, __, __1, __2;
// https://github.com/microsoft/TypeScript/issues/44872
void (_Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
}, _Foo.prop = 1, __ = {
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
}, _Foo);
