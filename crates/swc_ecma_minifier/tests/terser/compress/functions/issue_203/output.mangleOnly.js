var o = {};
var e = Function("require", "module", "exports", "module.exports = 42;");
e(null, o, o.exports);
console.log(o.exports);
