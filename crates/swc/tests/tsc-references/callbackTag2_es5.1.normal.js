import * as swcHelpers from "@swc/helpers";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: cb.js
/** @template T
 * @callback Id
 * @param {T} t
 * @returns {T} Maybe just return 120 and cast it?
 */ var x = 1;
/** @type {Id<string>} I actually wanted to write `const "120"` */ var one_twenty = function(s) {
    return "120";
};
var SharedClass = function SharedClass() {
    "use strict";
    swcHelpers.classCallCheck(this, SharedClass);
    /** @type {SharedId<S>} */ this.id;
};
/** @type {SharedId<number>} */ var outside = function(n) {
    return n + 1;
};
/** @type {Final<{ fantasy }, { heroes }>} */ var noreturn = function(barts, tidus, noctis) {
    return "cecil" /**
 * @template V,X
 * @callback Final
 * @param {V} barts - "Barts"
 * @param {X} tidus - Titus
 * @param {X & V} noctis - "Prince Noctis Lucius Caelum"
 * @return {"cecil" | "zidane"}
 */ ;
};
