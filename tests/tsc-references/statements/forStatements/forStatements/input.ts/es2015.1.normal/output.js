class C {
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
for(var aNumber = 9.9;;){
}
for(var aString = 'this is a string';;){
}
for(var aDate = new Date(12);;){
}
for(var anObject = new Object();;){
}
for(var anAny = null;;){
}
for(var aSecondAny = undefined;;){
}
for(var aVoid = undefined;;){
}
for(var anInterface = new C();;){
}
for(var aClass = new C();;){
}
for(var aGenericClass = new D();;){
}
for(var anObjectLiteral = {
    id: 12
};;){
}
for(var anOtherObjectLiteral = new C();;){
}
for(var aFunction = F;;){
}
for(var anOtherFunction = F;;){
}
for(var aLambda = (x)=>2
;;){
}
for(var aModule = M1;;){
}
for(var aClassInModule = new M1.A();;){
}
for(var aFunctionInModule = (x)=>'this is a string'
;;){
}
