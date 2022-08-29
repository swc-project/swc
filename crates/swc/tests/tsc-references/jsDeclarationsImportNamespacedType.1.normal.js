//// [file.js]
/** @type {import('./mod1').Dotted.Name} - should work */ var dot2;
export { };
//// [mod1.js]
/** @typedef {number} Dotted.Name */ export var dummy = 1;
