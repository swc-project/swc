//// [extendBooleanInterface.ts]
var x = true;
var a = x.doStuff();
var b = x.doOtherStuff('hm');
var c = x['doStuff']();
var d = x['doOtherStuff']('hm');
