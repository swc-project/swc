// @allowJs: true
// @checkJs: true
// @noEmit: true
// @Filename: type.js
/** @typedef {import("./mod1").TestEnum} TE */ /** @type {TE} */ var test = "add";
/** @type {import("./mod1").TestEnum} */ var tost = "remove";
// @Filename: value.js
import { TestEnum } from "./mod1";
/** @type {TestEnum} */ var tist = TestEnum.ADD;
// @Filename: mod1.js
/** @enum {string} */ export var TestEnum = {
    ADD: "add",
    REMOVE: "remove"
};
