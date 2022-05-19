function tempFun(tempStrs, g, x) {
    return g(x);
}
tempFun`${(x)=>x}  ${10}`, tempFun`${(x)=>x}  ${10}`, tempFun`${(x)=>x} ${10}`, tempFun`${(x)=>x} ${(x)=>x} ${10}`, tempFun`${(x)=>x} ${(x)=>x} ${10}`, tempFun`${(x)=>x} ${(x)=>x} ${10}`, tempFun`${(x)=>x} ${(x)=>x} ${10}`, tempFun`${(x)=>x} ${(x)=>x} ${void 0}`;
