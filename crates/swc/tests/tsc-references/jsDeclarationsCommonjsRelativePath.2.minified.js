//// [thing.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
module.exports = {
    Thing: function Thing() {
        _classCallCheck(this, Thing);
    }
};
//// [reexport.js]
"use strict";
var Thing = require("./thing").Thing;
module.exports = {
    Thing: Thing
};
