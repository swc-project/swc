// @allowJs: true
// @checkJs: true
// @target: es6
// @outDir: ./out
// @declaration: true
// @strict: true
// @noImplicitAny: false
// @filename: index.js
// these are recognized as TS concepts by the checker
/** @type {String} */ var a = "";
/** @type {Number} */ var b = 0;
/** @type {Boolean} */ var c = true;
/** @type {Void} */ var d = undefined;
/** @type {Undefined} */ var e = undefined;
/** @type {Null} */ var f = null;
/** @type {Function} */ var g = function() {
    return void 0;
};
/** @type {function} */ var h = function() {
    return void 0;
};
/** @type {array} */ var i = [];
/** @type {promise} */ var j = Promise.resolve(0);
/** @type {Object<string, string>} */ var k = {
    x: "x"
};
// these are not recognized as anything and should just be lookup failures
// ignore the errors to try to ensure they're emitted as `any` in declaration emit
// @ts-ignore
/** @type {class} */ var l = true;
// @ts-ignore
/** @type {bool} */ var m = true;
// @ts-ignore
/** @type {int} */ var n = true;
// @ts-ignore
/** @type {float} */ var o = true;
// @ts-ignore
/** @type {integer} */ var p = true;
// or, in the case of `event` likely erroneously refers to the type of the global Event object
/** @type {event} */ var q = undefined;
