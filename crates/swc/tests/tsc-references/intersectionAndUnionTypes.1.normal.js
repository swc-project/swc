//// [intersectionAndUnionTypes.ts]
var a;
var b;
var c;
var d;
var anb;
var aob;
var cnd;
var cod;
var x;
var y;
a = anb; // Ok
b = anb; // Ok
anb = a;
anb = b;
x = anb; // Ok
x = aob;
x = cnd; // Ok
x = cod;
anb = x;
aob = x;
cnd = x;
cod = x;
y = anb;
y = aob;
y = cnd;
y = cod;
anb = y;
aob = y; // Ok
cnd = y;
cod = y; // Ok
