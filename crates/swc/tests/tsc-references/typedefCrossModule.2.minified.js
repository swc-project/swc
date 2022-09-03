//// [commonjs.d.ts]
//// [mod1.js]
module.exports = C;
function C() {
    this.p = 1;
}
//// [mod2.js]
export function C() {
    this.p = 1;
}
//// [mod3.js]
exports.C = function() {
    this.p = 1;
};
//// [use.js]
var both1 = {
    type: "a",
    x: 1
}, both2 = both1, both3 = both2;
