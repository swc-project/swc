//// [file.tsx]
var Obj1;
<Obj1 x={10}/>; // Error, no render member
var Obj2;
<Obj2 x={32} render={100}/>; // OK
