import * as swcHelpers from "@swc/helpers";
var i, Foo = function() {
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    return Foo.prototype.y = function() {}, swcHelpers.createClass(Foo, [
        {
            key: "Z",
            get: function() {
                return 1;
            }
        }
    ]), Foo;
}();
i.x, i.y(), i.Z;
