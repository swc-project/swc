//// [file.tsx]
// Error
var Div = 3;
<Div/>;
// OK
function Fact() {
    return null;
}
<Fact/>;
// Error
function Fnum() {
    return 42;
}
<Fnum/>;
var Obj1;
<Obj1/>; // OK, prefer construct signatures
var Obj2;
<Obj2/>; // Error
var Obj3;
<Obj3/>; // Error
