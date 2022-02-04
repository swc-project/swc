function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _class;
// https://github.com/microsoft/TypeScript/issues/44872
void (_class = function() {
    var Foo = function Foo() {
        "use strict";
        _classCallCheck(this, Foo);
    };
    var __ = {
        writable: true,
        value: function() {
            console.log(Foo.prop);
            Foo.prop++;
        }()
    };
    var __1 = {
        writable: true,
        value: function() {
            console.log(Foo.prop);
            Foo.prop++;
        }()
    };
    var __2 = {
        writable: true,
        value: function() {
            console.log(Foo.prop);
            Foo.prop++;
        }()
    };
    return Foo;
}(), _class.prop = 1, _class);
