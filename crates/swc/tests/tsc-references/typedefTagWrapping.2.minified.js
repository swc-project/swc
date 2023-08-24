//// [typedefTagWrapping.ts]
//// [mod1.js]
/** 
 * @typedef {function(string): boolean}
 * Type1
 */ /**
 * Tries to use a type whose name is on a different
 * line than the typedef tag.
 * @param {Type1} func The function to call.
 * @param {string} arg The argument to call it with.
 * @returns {boolean} The return.
 */ //// [mod2.js]
/** 
 * @typedef {{
 *   num: number,
 *   str: string,
 *   boo: boolean
 * }} Type2
 */ /**
 * Makes use of a type with a multiline type expression.
 * @param {Type2} obj The object.
 * @returns {string|number} The return.
 */ //// [mod3.js]
/**
 * A function whose signature is very long.
 *
 * @typedef {function(boolean, string, number):
 *     (string|number)} StringOrNumber1
 */ /**
 * Makes use of a function type with a long signature.
 * @param {StringOrNumber1} func The function.
 * @param {boolean} bool The condition.
 * @param {string} str The string.
 * @param {number} num The number.
 * @returns {string|number} The return.
 */ //// [mod4.js]
/**
 * A function whose signature is very long.
 *
 * @typedef {function(boolean, string,
 *    number):
 *    (string|number)} StringOrNumber2
 */ /**
 * Makes use of a function type with a long signature.
 * @param {StringOrNumber2} func The function.
 * @param {boolean} bool The condition.
 * @param {string} str The string.
 * @param {number} num The number.
 * @returns {string|number} The return.
 */ //// [mod5.js]
/** 
 * @typedef {{
 *   num:
 *   number,
 *   str:
 *   string,
 *   boo:
 *   boolean
 * }} Type5
 */ /**
 * Makes use of a type with a multiline type expression.
 * @param {Type5} obj The object.
 * @returns {string|number} The return.
 */ //// [mod6.js]
/** 
 * @typedef {{
 *   foo:
 *   *,
 *   bar:
 *   *
 * }} Type6
 */ /**
 * Makes use of a type with a multiline type expression.
 * @param {Type6} obj The object.
 * @returns {*} The return.
 */ //// [mod7.js]
/** 
   Multiline type expressions in comments without leading * are not supported.
   @typedef {{
     foo:
     *,
     bar:
     *
   }} Type7
 */ 
