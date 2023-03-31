//// [thing.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _class_call_check = require("@swc/helpers/lib/_class_call_check.js").default;
var Thing = function Thing() {
    _class_call_check(this, Thing);
};
module.exports = {
    Thing: Thing
};
//// [reexport.js]
"use strict";
var Thing = require("./thing").Thing;
module.exports = {
    Thing: Thing
};
