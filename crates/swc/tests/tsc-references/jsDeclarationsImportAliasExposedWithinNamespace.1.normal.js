//// [file.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "myTypes", {
    enumerable: true,
    get: function() {
        return myTypes;
    }
});
/**
 * @namespace myTypes
 * @global
 * @type {Object<string,*>}
 */ const myTypes = {
};
//// [file2.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get testFn () {
        return testFn;
    },
    get testFnTypes () {
        return testFnTypes;
    }
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
