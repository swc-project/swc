//// [./a.js]
/**
 * @callback C
 * @this {{ a: string, b: number }}
 * @param {string} a
 * @param {number} b
 * @returns {boolean}
 */ /** @type {C} */ var cb = function cb(a, b) {
    this;
    return true;
};
