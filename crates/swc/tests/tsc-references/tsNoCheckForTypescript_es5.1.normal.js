function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @declaration: true
// @filename: file.ts
// @ts-nocheck
export var a = 1 + {}; // This is an error, ofc, `Operator '+' cannot be applied to types '1' and '{}'`, which will be suppressed by the `nocheck` comment
export var Bet = function Bet() {
    "use strict";
    _classCallCheck(this, Bet);
    this.q = "lol" // And so will this implements error
    ;
};
