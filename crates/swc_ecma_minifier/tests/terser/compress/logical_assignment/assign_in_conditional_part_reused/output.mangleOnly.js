var l = "PASS";
var o = null;
var p = {
    prop: null
};
o &&= console.log((l = "FAIL"));
p.prop &&= console.log((l = "FAIL"));
console.log(l, o, p.prop);
