//// [thing.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _class_call_check = require("@swc/helpers/lib/_class_call_check.js").default;
module.exports = {
    Thing: function Thing() {
        _class_call_check(this, Thing);
    }
};
//// [reexport.js]
"use strict";
var Thing = require("./thing").Thing;
module.exports = {
    Thing: Thing
};
