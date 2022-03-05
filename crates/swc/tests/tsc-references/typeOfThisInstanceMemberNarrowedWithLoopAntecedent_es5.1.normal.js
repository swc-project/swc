import * as swcHelpers from "@swc/helpers";
var SomeClass = /*#__PURE__*/ function() {
    "use strict";
    function SomeClass() {
        swcHelpers.classCallCheck(this, SomeClass);
    }
    swcHelpers.createClass(SomeClass, [
        {
            key: "method",
            value: function method() {
                while(0){}
                this.state.data;
                if (this.state.type === "stringVariant") {
                    var s = this.state.data;
                }
            }
        }
    ]);
    return SomeClass;
}();
var SomeClass2 = /*#__PURE__*/ function() {
    "use strict";
    function SomeClass2() {
        swcHelpers.classCallCheck(this, SomeClass2);
    }
    swcHelpers.createClass(SomeClass2, [
        {
            key: "method",
            value: function method() {
                var ref;
                var c = false;
                while(c){}
                if (this.state.type === "numberVariant") {
                    this.state.data;
                }
                var n = (ref = this.state) === null || ref === void 0 ? void 0 : ref.data; // This should be an error
            }
        }
    ]);
    return SomeClass2;
}();
