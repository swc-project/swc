//// [symbolType13.ts]
var s = Symbol();
var x;
for(s in {}){}
for(x in s){}
for(var y in s){}
