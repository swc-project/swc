// objects with call signatures should be permitted where function types are expected
// no errors expected below
var i;
var r2 = i();
var r2b = i.apply;
var b;
var r4 = b();
var rb4 = b.apply;
