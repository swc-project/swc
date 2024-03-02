//// [commonjs.d.ts]
//// [mod1.js]
module.exports = function() {
    this.p = 1;
};
//// [mod2.js]
export function C() {
    this.p = 1;
}
//// [mod3.js]
exports.C = function() {
    this.p = 1;
};
//// [use.js]
