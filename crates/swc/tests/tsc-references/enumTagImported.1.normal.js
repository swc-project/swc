//// [type.js]
/** @typedef {import("./mod1").TestEnum} TE */ /** @type {TE} */ var test = 'add';
/** @type {import("./mod1").TestEnum} */ var tost = 'remove';
//// [value.js]
import { TestEnum } from "./mod1";
/** @type {TestEnum} */ var tist = TestEnum.ADD;
//// [mod1.js]
/** @enum {string} */ export var TestEnum = {
    ADD: 'add',
    REMOVE: 'remove'
};
