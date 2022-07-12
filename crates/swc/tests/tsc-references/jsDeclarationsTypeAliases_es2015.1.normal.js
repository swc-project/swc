// @allowJs: true
// @checkJs: true
// @outDir: ./out
// @declaration: true
// @filename: index.js
/**
 * @typedef {string | number | symbol} PropName 
 */ /**
 * Callback
 *
 * @callback NumberToStringCb
 * @param {number} a
 * @returns {string}
 */ /**
 * @template T
 * @typedef {T & {name: string}} MixinName 
 */ /**
 * Identity function
 *
 * @template T
 * @callback Identity
 * @param {T} x
 * @returns {T}
 */ // @filename: mixed.js
/**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ function doTheThing(x) {
    return {
        x: "" + x
    };
}
class ExportedThing {
    constructor(){
        this.z = "ok";
    }
}
module.exports = {
    doTheThing,
    ExportedThing
};
class LocalThing {
    constructor(){
        this.y = "ok";
    }
}
export { };
