var r = {};
var l = Function("require", "module", "exports", "module.exports = 42;");
l(null, r, r.exports);
console.log(r.exports);
