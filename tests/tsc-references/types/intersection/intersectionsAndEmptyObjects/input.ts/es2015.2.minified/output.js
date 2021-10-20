const intersectDictionaries = (d1, d2)=>Object.assign({
    }, d1, d2)
, testDictionary = (_value)=>{
}, d11 = {
};
testDictionary(d11);
const d21 = intersectDictionaries(d11, d11);
testDictionary(d21);
const d3 = {
    s: ""
};
testDictionary(d3);
const d4 = intersectDictionaries(d11, d3);
testDictionary(d4);
const d5 = intersectDictionaries(d3, d11);
testDictionary(d5);
const d6 = intersectDictionaries(d3, d3);
testDictionary(d6), mock(import("./ex"));
export { };
