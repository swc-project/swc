//// [intersectionsAndEmptyObjects.ts]
// Empty object type literals are removed from intersections types
// that contain other object types
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
let x01;
let x02;
let x03;
let x04;
let x05;
let x06;
let x07;
let x08;
let x09;
let x10;
let x11;
let x12;
let x13;
let x14;
const intersectDictionaries = (d1, d2)=>Object.assign({}, d1, d2);
const testDictionary = (_value)=>{};
const d1 = {};
testDictionary(d1);
const d2 = intersectDictionaries(d1, d1);
testDictionary(d2);
const d3 = {
    s: ''
};
testDictionary(d3);
const d4 = intersectDictionaries(d1, d3);
testDictionary(d4);
const d5 = intersectDictionaries(d3, d1);
testDictionary(d5);
const d6 = intersectDictionaries(d3, d3);
testDictionary(d6);
var defaultChoices;
var defaultChoicesAndEmpty;
var myChoices;
var myChoicesAndEmpty;
var unknownChoices;
var unknownChoicesAndEmpty;
mock(Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./ex"))));
//// [ex.d.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
