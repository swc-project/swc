//// [intersectionsAndEmptyObjects.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, intersectDictionaries = (d1, d2)=>Object.assign({}, d1, d2), testDictionary = (_value)=>{}, d1 = {};
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
