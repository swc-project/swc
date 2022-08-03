var l = "PASS";
var o = null;
var r = {
    prop: null
};
o &&= console.log((l = "FAIL"));
r.prop &&= console.log((l = "FAIL"));
console.log(l);
