function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * Identity function
 *
 * @template T
 * @callback Identity
 * @param {T} x
 * @returns {T}
 */ // @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @template T
 * @typedef {T & {name: string}} MixinName 
 */ // @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * Identity function
 *
 * @template T
 * @callback Identity
 * @param {T} x
 * @returns {T}
 */ // @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * Callback
 *
 * @callback NumberToStringCb
 * @param {number} a
 * @returns {string}
 */ // @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * Identity function
 *
 * @template T
 * @callback Identity
 * @param {T} x
 * @returns {T}
 */ // @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @template T
 * @typedef {T & {name: string}} MixinName 
 */ // @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * Identity function
 *
 * @template T
 * @callback Identity
 * @param {T} x
 * @returns {T}
 */ // @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {string | number | symbol} PropName 
 */ // @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * Identity function
 *
 * @template T
 * @callback Identity
 * @param {T} x
 * @returns {T}
 */ // @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @template T
 * @typedef {T & {name: string}} MixinName 
 */ // @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * Identity function
 *
 * @template T
 * @callback Identity
 * @param {T} x
 * @returns {T}
 */ // @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * Callback
 *
 * @callback NumberToStringCb
 * @param {number} a
 * @returns {string}
 */ // @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * Identity function
 *
 * @template T
 * @callback Identity
 * @param {T} x
 * @returns {T}
 */ // @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @template T
 * @typedef {T & {name: string}} MixinName 
 */ // @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * Identity function
 *
 * @template T
 * @callback Identity
 * @param {T} x
 * @returns {T}
 */ // @filename: mixed.js
/**
 * @param {number} x
 * @returns {SomeType}
 */ /**
 * @typedef {{x: string} | number | LocalThing | ExportedThing} SomeType
 */ /**
 * @param {number} x
 * @returns {SomeType}
 */ function doTheThing(x) {
    return {
        x: "" + x
    };
}
var ExportedThing = function ExportedThing() {
    "use strict";
    _classCallCheck(this, ExportedThing);
    this.z = "ok";
};
module.exports = {
    doTheThing: doTheThing,
    ExportedThing: ExportedThing
};
var LocalThing = function LocalThing() {
    "use strict";
    _classCallCheck(this, LocalThing);
    this.y = "ok";
};
// @allowJs: true
// @checkJs: true
// @outDir: ./out
// @declaration: true
// @filename: index.js
export { };
