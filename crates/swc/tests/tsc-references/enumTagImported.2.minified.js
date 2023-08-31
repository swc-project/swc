//// [type.js]
/** @typedef {import("./mod1").TestEnum} TE */ /** @type {TE} */ //// [value.js]
import { TestEnum } from "./mod1";
/** @type {TestEnum} */ TestEnum.ADD;
//// [mod1.js]
/** @enum {string} */ export var TestEnum = {
    ADD: "add",
    REMOVE: "remove"
};
