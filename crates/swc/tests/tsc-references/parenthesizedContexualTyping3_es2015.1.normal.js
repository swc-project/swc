function tempFun(tempStrs, g1, x) {
    return g1(x);
}
var a = tempFun`${(x)=>x}  ${10}`;
var b = tempFun`${(x)=>x}  ${10}`;
var c = tempFun`${(x)=>x} ${10}`;
var d = tempFun`${(x)=>x} ${(x)=>x} ${10}`;
var e = tempFun`${(x)=>x} ${(x)=>x} ${10}`;
var f = tempFun`${(x)=>x} ${(x)=>x} ${10}`;
var g = tempFun`${(x)=>x} ${(x)=>x} ${10}`;
var h = tempFun`${(x)=>x} ${(x)=>x} ${undefined}`;
