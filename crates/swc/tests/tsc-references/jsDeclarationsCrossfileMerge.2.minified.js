//// [index.js]
var m = require("./exporter");
module.exports = m.default, module.exports.memberName = "thing";
//// [exporter.js]
export default function() {};
