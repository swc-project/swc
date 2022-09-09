var n = function n() {};
var o = n.prototype;
var t = o.x;
o.initialContext = function n() {
    o.y;
    console.log("PASS");
};
o.braceIsBlock = function () {};
new n().initialContext();
