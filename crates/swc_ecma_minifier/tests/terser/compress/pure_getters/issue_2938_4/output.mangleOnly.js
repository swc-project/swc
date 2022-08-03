var n = function n() {};
var t = n.prototype;
var i = t.x;
t.initialContext = function n() {
    t.y;
    console.log("PASS");
};
t.braceIsBlock = function() {};
new n().initialContext();
