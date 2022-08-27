//// [parenthesizedContexualTyping3.ts]
// Contextual typing for parenthesized substitution expressions in tagged templates.
/**
 * tempFun - Can't have fun for too long.
 */ function tempFun(tempStrs, g, x) {
    return g(x);
}
var a = tempFun`${(x)=>x}  ${10}`;
var b = tempFun`${(x)=>x}  ${10}`;
var c = tempFun`${(x)=>x} ${10}`;
var d = tempFun`${(x)=>x} ${(x)=>x} ${10}`;
var e = tempFun`${(x)=>x} ${(x)=>x} ${10}`;
var f = tempFun`${(x)=>x} ${(x)=>x} ${10}`;
var g = tempFun`${(x)=>x} ${(x)=>x} ${10}`;
var h = tempFun`${(x)=>x} ${(x)=>x} ${undefined}`;
