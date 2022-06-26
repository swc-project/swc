var a = function a() {};
var b = a.prototype;
var c = b.x;
b.initialContext = function a() {
    b.y;
    console.log("PASS");
};
b.braceIsBlock = function() {};
new a().initialContext();
