var a = "PASS";
var b = null;
var c = {
    prop: null
};
b &&= console.log((a = "FAIL"));
c.prop &&= console.log((a = "FAIL"));
console.log(a, b, c.prop);
