//// [file.js]
/**
 * @namespace myTypes
 * @global
 * @type {Object<string,*>}
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "myTypes", {
    enumerable: true,
    get: ()=>myTypes
});
const myTypes = {
};
//// [file2.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    testFn: ()=>testFn,
    testFnTypes: ()=>testFnTypes
});
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
