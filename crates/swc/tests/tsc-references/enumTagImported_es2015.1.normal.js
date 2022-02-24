// @allowJs: true
// @checkJs: true
// @noEmit: true
// @Filename: type.js
/** @type {TE} */ /** @typedef {import("./mod1").TestEnum} TE */ /** @type {TE} */ const test = 'add';
/** @type {import("./mod1").TestEnum} */ const tost = 'remove';
/** @type {TestEnum} */ const tist = TestEnum.ADD;
// @Filename: mod1.js
/** @enum {string} */ export const TestEnum = {
    ADD: 'add',
    REMOVE: 'remove'
};
