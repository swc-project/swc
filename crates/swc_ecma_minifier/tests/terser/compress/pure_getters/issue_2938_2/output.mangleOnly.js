var n = function n() {};
var o = n.prototype;
o.initialContext = function n() {
    console.log("PASS");
};
o.braceIsBlock = function () {};
new n().initialContext();
