// @declaration: true
// @emitDeclarationOnly: true
// @checkJs: true
// @filename: file.js
/** @type {import('./mod1').Dotted.Name} - should work */ var dot2;
export { };
// @filename: mod1.js
/** @typedef {number} Dotted.Name */ export var dummy = 1;
