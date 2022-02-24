// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: github20832.js
// #20832
/**
 * @template U
 * @param {U} x
 * @return {T}
 */ /** @typedef {U} T - should be "error, can't find type named 'U' */ /**
 * @template U
 * @param {U} x
 * @return {T}
 */ function f(x1) {
    return x1;
}
/** @type T - should be fine, since T will be any */ var x = 3;
/**
 * @template V
 * @param {V} vvvvv
 */ /**
 * @callback Cb
 * @param {V} firstParam
 */ /**
 * @template V
 * @param {V} vvvvv
 */ function g(vvvvv) {}
/** @type {Cb} */ var cb = function(x) {};
