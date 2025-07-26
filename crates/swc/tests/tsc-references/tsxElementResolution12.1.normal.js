//// [file.tsx]
var Obj1;
<Obj1 x={10}/>; // OK
var Obj2;
<Obj2 x={10}/>; // OK
var Obj3;
<Obj3 x={10}/>; // Error
var attributes;
<Obj3 {...attributes}/>; // Error
<Obj3 {...{}}/>; // OK
var Obj4;
<Obj4 x={10}/>; // OK
<Obj4 x={'10'}/>; // Error
