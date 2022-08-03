var n = function n() {};
var t = n.prototype;
t.initialContext = function n() {
    console.log("PASS");
};
t.braceIsBlock = function() {};
new n().initialContext();
