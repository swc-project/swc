//// [switchCaseWithIntersectionTypes01.ts]
var strAndNum;
var numAndBool;
var str;
var num;
var bool;
switch(strAndNum){
    // Identical
    case strAndNum:
        break;
    // Constituents
    case str:
    case num:
        break;
    // Overlap in constituents
    case numAndBool:
        break;
    // No relation
    case bool:
        break;
}
