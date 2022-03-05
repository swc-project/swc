import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C(t, z, x) {
        arguments.length > 3 && void 0 !== arguments[3] && arguments[3], swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function(x) {
                arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            }
        },
        {
            key: "foo1",
            value: function(x) {
                arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)rest[_key - 2] = arguments[_key];
            }
        },
        {
            key: "bar",
            value: function() {
                arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
            }
        },
        {
            key: "boo",
            value: function() {
                arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)rest[_key - 1] = arguments[_key];
            }
        }
    ]), C;
}(), D = function() {
    "use strict";
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], swcHelpers.classCallCheck(this, D);
}, E = function() {
    "use strict";
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)rest[_key - 1] = arguments[_key];
    swcHelpers.classCallCheck(this, E);
};
