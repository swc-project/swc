function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var Foo = function() {
    "use strict";
    _classCallCheck(this, Foo);
};
exports.Bar = function _class() {
    "use strict";
    _classCallCheck(this, _class);
}, module.exports = {
    Baz: function _class() {
        "use strict";
        _classCallCheck(this, _class);
    }
}, exports.Quid = 2, module.exports = {
    Quack: 2
}, new (require("./mod1.js")).Baz();
