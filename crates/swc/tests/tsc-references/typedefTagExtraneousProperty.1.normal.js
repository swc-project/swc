//// [typedefTagExtraneousProperty.js]
/** @typedef {Object.<string,string>} Mmap
 * @property {string} ignoreMe - should be ignored
 */ /** @type {Mmap} */ var y = {
    bye: "no"
};
y;
y.ignoreMe = "ok but just because of the index signature";
y['hi'] = "yes";
