import * as swcHelpers from "@swc/helpers";
var C = // @target:es6
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "name",
            get: function get() {
                return this._name;
            }
        },
        {
            key: "computedname1",
            get: function get() {
                return "";
            }
        },
        {
            key: "computedname2",
            get: function get() {
                return "";
            }
        },
        {
            key: "computedname3",
            set: function set(x) {}
        },
        {
            key: "computedname4",
            set: function set(y) {}
        },
        {
            key: "foo",
            set: function set(a) {}
        }
    ], [
        {
            key: "name2",
            get: function get() {
                return "BYE";
            }
        },
        {
            key: "computedname",
            get: function get() {
                return "";
            }
        },
        {
            key: "bar",
            set: function set(b) {}
        },
        {
            key: "computedname",
            set: function set(b) {}
        }
    ]);
    return C;
}();
