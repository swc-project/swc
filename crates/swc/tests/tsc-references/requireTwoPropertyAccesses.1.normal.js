//// [requireTwoPropertyAccesses.ts]
// @declaration
//// [mod.js]
module.exports = {
    x: {
        y: "value"
    }
};
//// [requireTwoPropertyAccesses.js]
var value = require("./mod").x.y;
console.log(value);
