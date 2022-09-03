//// [parenthesizedContexualTyping3.ts]
function tempFun(tempStrs, g, x) {
    return g(x);
}
var a = tempFun`${(x)=>x}  ${10}`, b = tempFun`${(x)=>x}  ${10}`, c = tempFun`${(x)=>x} ${10}`, d = tempFun`${(x)=>x} ${(x)=>x} ${10}`, e = tempFun`${(x)=>x} ${(x)=>x} ${10}`, f = tempFun`${(x)=>x} ${(x)=>x} ${10}`, g = tempFun`${(x)=>x} ${(x)=>x} ${10}`, h = tempFun`${(x)=>x} ${(x)=>x} ${void 0}`;
