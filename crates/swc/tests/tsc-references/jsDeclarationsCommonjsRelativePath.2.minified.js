//// [thing.js]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
module.exports = {
    Thing: function Thing() {
        _class_call_check._(this, Thing);
    }
};
//// [reexport.js]
module.exports = {
    Thing: require("./thing").Thing
};
