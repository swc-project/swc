import * as swcHelpers from "@swc/helpers";
var SomeClass = function() {
    "use strict";
    function SomeClass() {
        swcHelpers.classCallCheck(this, SomeClass);
    }
    return swcHelpers.createClass(SomeClass, [
        {
            key: "method",
            value: function() {
                this.state.data, "stringVariant" === this.state.type && this.state.data;
            }
        }
    ]), SomeClass;
}(), SomeClass2 = function() {
    "use strict";
    function SomeClass2() {
        swcHelpers.classCallCheck(this, SomeClass2);
    }
    return swcHelpers.createClass(SomeClass2, [
        {
            key: "method",
            value: function() {
                var ref;
                "numberVariant" === this.state.type && this.state.data, null === (ref = this.state) || void 0 === ref || ref.data;
            }
        }
    ]), SomeClass2;
}();
