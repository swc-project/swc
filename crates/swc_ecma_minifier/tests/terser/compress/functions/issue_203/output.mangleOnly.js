var e = {};
var r = Function("require", "module", "exports", "module.exports = 42;");
r(null, e, e.exports);
console.log(e.exports);
