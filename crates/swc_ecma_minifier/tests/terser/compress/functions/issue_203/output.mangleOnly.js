var a = {};
var b = Function("require", "module", "exports", "module.exports = 42;");
b(null, a, a.exports);
console.log(a.exports);
