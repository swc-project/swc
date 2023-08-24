//// [file.js]
/**
 * @namespace myTypes
 * @global
 * @type {Object<string,*>}
 */ /** @typedef {string|RegExp|Array<string|RegExp>} myTypes.typeA */ /**
 * @typedef myTypes.typeB
 * @property {myTypes.typeA}    prop1 - Prop 1.
 * @property {string}           prop2 - Prop 2.
 */ /** @typedef {myTypes.typeB|Function} myTypes.typeC */ exports.myTypes = {
};
//// [file2.js]
const { myTypes } = require('./file.js');
module.exports = {
    testFn: /** @typedef {boolean|myTypes.typeC} testFnTypes.input */ /**
 * @function testFn
 * @description A test function.
 * @param {testFnTypes.input} input - Input.
 * @returns {number|null} Result.
 */ function(input) {
        return 'number' == typeof input ? 2 * input : null;
    },
    testFnTypes: {
    }
};
