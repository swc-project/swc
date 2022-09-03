//// [contextualTypeWithUnionTypeObjectLiteral.ts]
var str, num, objStr, objNum, i11, i21, strOrNumber, strOrNumber = str || num, objStrOrNum1 = objStr || objNum, objStrOrNum2 = objStr || objNum, objStrOrNum3 = {
    prop: strOrNumber
}, objStrOrNum4 = {
    prop: strOrNumber
}, objStrOrNum5 = {
    prop: strOrNumber
}, objStrOrNum6 = {
    prop: strOrNumber,
    anotherP: str
}, objStrOrNum7 = {
    prop: strOrNumber,
    anotherP: str
}, objStrOrNum8 = {
    prop: strOrNumber,
    anotherP: str,
    anotherP1: num
}, i11Ori21 = i11, i11Ori21 = i21, i11Ori21 = {
    commonMethodDifferentReturnType: function(a, b) {
        return a.charAt(b);
    }
}, i11Ori21 = {
    commonMethodDifferentReturnType: function(a, b) {
        return a.charCodeAt(b);
    }
}, i11Ori21 = {
    commonMethodDifferentReturnType: function(a, b) {
        return strOrNumber;
    }
};
