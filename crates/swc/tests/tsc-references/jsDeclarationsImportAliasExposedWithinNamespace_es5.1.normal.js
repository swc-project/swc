// @declaration: true
// @emitDeclarationOnly: true
// @allowJs: true
// @checkJs: true
// @module: commonjs
// @target: es6
// @filename: file.js
/**
 * @namespace myTypes
 * @global
 * @type {Object<string,*>}
 */ var myTypes = {
};
/** @typedef {string|RegExp|Array<string|RegExp>} myTypes.typeA */ /**
 * @typedef myTypes.typeB
 * @property {myTypes.typeA}    prop1 - Prop 1.
 * @property {string}           prop2 - Prop 2.
 */ /** @typedef {myTypes.typeB|Function} myTypes.typeC */ export { myTypes };
// @filename: file2.js
/**
 * @namespace testFnTypes
 * @global
 * @type {Object<string,*>}
 */ var testFnTypes = {
};
/** @typedef {boolean|myTypes.typeC} testFnTypes.input */ /**
 * @function testFn
 * @description A test function.
 * @param {testFnTypes.input} input - Input.
 * @returns {number|null} Result.
 */ function testFn(input) {
    if (typeof input === "number") {
        return 2 * input;
    } else {
        return null;
    }
}
export { testFn, testFnTypes };
