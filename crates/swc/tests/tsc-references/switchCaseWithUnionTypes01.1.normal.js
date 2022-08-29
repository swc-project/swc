//// [switchCaseWithUnionTypes01.ts]
var strOrNum;
var numOrBool;
var str;
var num;
var bool;
switch(strOrNum){
    // Identical
    case strOrNum:
        break;
    // Constituents
    case str:
    case num:
        break;
    // Overlap in constituents
    case numOrBool:
        break;
    // No relation
    case bool:
        break;
}
