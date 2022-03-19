import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
exports.Bar = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class);
}, module.exports = {
    Baz: function _class() {
        "use strict";
        swcHelpers.classCallCheck(this, _class);
    }
}, exports.Quid = 2, module.exports = {
    Quack: 2
}, new (require('./mod1.js')).Baz();
