var o = function n() {};
var n = o.prototype;
var t = n.x;
n.initialContext = function o() {
    n.y;
    console.log("PASS");
};
n.braceIsBlock = function() {};
new o().initialContext();
