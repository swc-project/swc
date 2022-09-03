//// [typeGuardOfFormFunctionEquality.ts]
isString1(0, ""), isString2("");
var x = isString1(0, "") === isString2("");
function isString3(a, b, c) {
    return isString1(0, c);
}
