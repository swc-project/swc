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
function foo() {
}
