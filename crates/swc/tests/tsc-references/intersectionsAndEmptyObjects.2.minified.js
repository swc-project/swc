//// [intersectionsAndEmptyObjects.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard"), intersectDictionaries = (d1, d2)=>Object.assign({}, d1, d2), testDictionary = (_value)=>{}, d1 = {};
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
testDictionary(d6), mock(Promise.resolve().then(()=>_interop_require_wildcard._(require("./ex"))));
//// [ex.d.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
