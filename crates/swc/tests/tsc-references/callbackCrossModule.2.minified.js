//// [mod1.js]
/** @callback Con - some kind of continuation
 * @param {object | undefined} error
 * @return {any} I don't even know what this should return
 */ module.exports = function() {
    this.p = 1;
};
//// [use.js]
/** @param {import('./mod1').Con} k */ 
