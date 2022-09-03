//// [intersectionsAndEmptyObjects.ts]
"use strict";
var defaultChoices, defaultChoicesAndEmpty, myChoices, myChoicesAndEmpty, unknownChoices, unknownChoicesAndEmpty;
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
let x01, x02, x03, x04, x05, x06, x07, x08, x09, x10, x11, x12, x13, x14;
const intersectDictionaries = (d1, d2)=>Object.assign({}, d1, d2), testDictionary = (_value)=>{}, d1 = {};
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
testDictionary(d6), mock(Promise.resolve().then(()=>_interopRequireWildcard(require("./ex"))));
//// [ex.d.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
