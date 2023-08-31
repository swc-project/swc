//// [parenthesizedContexualTyping3.ts]
// Contextual typing for parenthesized substitution expressions in tagged templates.
/**
 * tempFun - Can't have fun for too long.
 */ function tempFun(tempStrs, g, x) {
    return g(x);
}
tempFun`${(x)=>x}  ${10}`, tempFun`${(x)=>x}  ${10}`, tempFun`${(x)=>x} ${10}`, tempFun`${(x)=>x} ${(x)=>x} ${10}`, tempFun`${(x)=>x} ${(x)=>x} ${10}`, tempFun`${(x)=>x} ${(x)=>x} ${10}`, tempFun`${(x)=>x} ${(x)=>x} ${10}`, tempFun`${(x)=>x} ${(x)=>x} ${void 0}`;
