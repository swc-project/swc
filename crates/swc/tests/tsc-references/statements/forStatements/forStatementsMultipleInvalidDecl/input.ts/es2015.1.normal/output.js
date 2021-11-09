class C {
}
class C2 extends C {
}
class D {
}
function F(x) {
    return 42;
}
var M1;
(function(M) {
    class A {
    }
    M.A = A;
    function F2(x) {
        return x.toString();
    }
    M.F2 = F2;
})(M1 || (M1 = {
}));
// all of these are errors
for(var a;;){
}
for(var a = 1;;){
}
for(var a = 'a string';;){
}
for(var a = new C();;){
}
for(var a = new D();;){
}
for(var a = M1;;){
}
for(var b;;){
}
for(var b = new C();;){
}
for(var b = new C2();;){
}
for(var f = F;;){
}
for(var f = (x)=>''
;;){
}
for(var arr;;){
}
for(var arr = [
    1,
    2,
    3,
    4
];;){
}
for(var arr = [
    new C(),
    new C2(),
    new D()
];;){
}
for(var arr2 = [
    new D()
];;){
}
for(var arr2 = new Array();;){
}
for(var m;;){
}
for(var m = M1.A;;){
}
