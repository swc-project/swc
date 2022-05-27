var b = function a() {};
var a = b.prototype;
var c = a.x;
a.initialContext = function b() {
    a.y;
    console.log("PASS");
};
a.braceIsBlock = function() {};
new b().initialContext();
