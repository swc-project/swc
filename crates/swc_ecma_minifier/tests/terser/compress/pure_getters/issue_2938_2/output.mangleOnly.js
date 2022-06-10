var a = function a() {};
var b = a.prototype;
b.initialContext = function a() {
    console.log("PASS");
};
b.braceIsBlock = function() {};
new a().initialContext();
