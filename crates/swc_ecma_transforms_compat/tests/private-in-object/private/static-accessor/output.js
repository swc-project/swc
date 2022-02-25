let Foo = function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
    }
    _createClass(Foo, [
        {
            key: "test",
            value: function test(other) {
                return other === Foo;
            }
        }
    ]);
    return Foo;
}();
var _foo = {
    get: get_foo,
    set: void 0
};
function get_foo() {}
