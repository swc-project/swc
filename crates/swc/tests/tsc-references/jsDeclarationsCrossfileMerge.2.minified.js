//// [index.js]
module.exports = require("./exporter").default, module.exports.memberName = "thing";
//// [exporter.js]
export default function() {}
