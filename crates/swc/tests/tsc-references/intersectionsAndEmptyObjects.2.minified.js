//// [intersectionsAndEmptyObjects.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard"), intersectDictionaries = (d1, d2)=>Object.assign({}, d1, d2), testDictionary = (_value)=>{}, d1 = {};
testDictionary(d1), testDictionary(intersectDictionaries(d1, d1));
const d3 = {
    s: ''
};
testDictionary(d3), testDictionary(intersectDictionaries(d1, d3)), testDictionary(intersectDictionaries(d3, d1)), testDictionary(intersectDictionaries(d3, d3)), mock(Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./ex"))));
//// [ex.d.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
