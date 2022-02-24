// @declaration: true
// @outDir: bin/
// @checkJs: true
// @Filename: callbackTagVariadicType.js
/** @type {Foo} */ /**
 * @callback Foo
 * @param {...string} args
 * @returns {number}
 */ /** @type {Foo} */ export var x = function() {
    return 1;
};
var res = x('a', 'b');
