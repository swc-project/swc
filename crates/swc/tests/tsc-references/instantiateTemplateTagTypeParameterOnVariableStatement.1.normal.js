//// [instantiateTemplateTagTypeParameterOnVariableStatement.js]
/**
 * @template T
 * @param {T} a
 * @returns {(b: T) => T}
 */ var seq = function(a) {
    return function(b) {
        return b;
    };
};
var text1 = "hello";
var text2 = "world";
/** @type {string} */ var text3 = seq(text1)(text2);
