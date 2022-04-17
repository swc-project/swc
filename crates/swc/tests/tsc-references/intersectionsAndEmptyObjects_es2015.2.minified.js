let intersectDictionaries = (d11, d21)=>Object.assign({}, d11, d21)
, testDictionary = (_value)=>{}, d1 = {};
testDictionary(d1);
let d2 = intersectDictionaries(d1, d1);
testDictionary(d2);
let d3 = {
    s: ''
};
testDictionary(d3);
let d4 = intersectDictionaries(d1, d3);
testDictionary(d4);
let d5 = intersectDictionaries(d3, d1);
testDictionary(d5);
let d6 = intersectDictionaries(d3, d3);
testDictionary(d6), mock(import('./ex'));
export { };
