import * as swcHelpers from "@swc/helpers";
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "name",
            get: function() {
                return this._name;
            }
        },
        {
            key: "computedname1",
            get: function() {
                return "";
            }
        },
        {
            key: "computedname2",
            get: function() {
                return "";
            }
        },
        {
            key: "computedname3",
            set: function(x) {}
        },
        {
            key: "computedname4",
            set: function(y) {}
        },
        {
            key: "foo",
            set: function(a) {}
        }
    ], [
        {
            key: "name2",
            get: function() {
                return "BYE";
            }
        },
        {
            key: "computedname",
            get: function() {
                return "";
            }
        },
        {
            key: "bar",
            set: function(b) {}
        },
        {
            key: "computedname",
            set: function(b) {}
        }
    ]), C;
}();
