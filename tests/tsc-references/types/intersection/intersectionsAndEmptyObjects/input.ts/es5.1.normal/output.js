var x01;
var x02;
var x03;
var x04;
var x05;
var x06;
var x07;
var x08;
var x09;
var x10;
var x11;
var x12;
var x13;
var x14;
var intersectDictionaries = function(d1, d2) {
    return Object.assign({
    }, d1, d2);
};
var testDictionary = function(_value) {
};
var d11 = {
};
testDictionary(d11);
var d21 = intersectDictionaries(d11, d11);
testDictionary(d21);
var d3 = {
    s: ''
};
testDictionary(d3);
var d4 = intersectDictionaries(d11, d3);
testDictionary(d4);
var d5 = intersectDictionaries(d3, d11);
testDictionary(d5);
var d6 = intersectDictionaries(d3, d3);
testDictionary(d6);
var defaultChoices;
var defaultChoicesAndEmpty;
var myChoices;
var myChoicesAndEmpty;
var unknownChoices;
var unknownChoicesAndEmpty;
mock(import('./ex'));
// @target: es2015
// @module: commonjs
// @esModuleInterop: true
// @filename: intersectionsAndEmptyObjects.ts
// Empty object type literals are removed from intersections types
// that contain other object types
export { };
