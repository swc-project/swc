//// [file.js]
/**
 * @namespace myTypes
 * @global
 * @type {Object<string,*>}
 */ "use strict";
const myTypes = {
};
/** @typedef {string|RegExp|Array<string|RegExp>} myTypes.typeA */ /**
 * @typedef myTypes.typeB
 * @property {myTypes.typeA}    prop1 - Prop 1.
 * @property {string}           prop2 - Prop 2.
 */ /** @typedef {myTypes.typeB|Function} myTypes.typeC */ exports.myTypes = myTypes;
//// [file2.js]
"use strict";
const { myTypes  } = require('./file.js');
/**
 * @namespace testFnTypes
 * @global
 * @type {Object<string,*>}
 */ const testFnTypes = {
};
/** @typedef {boolean|myTypes.typeC} testFnTypes.input */ /**
 * @function testFn
 * @description A test function.
 * @param {testFnTypes.input} input - Input.
 * @returns {number|null} Result.
 */ function testFn(input) {
    if (typeof input === 'number') {
        return 2 * input;
    } else {
        return null;
    }
}
module.exports = {
    testFn,
    testFnTypes
};
