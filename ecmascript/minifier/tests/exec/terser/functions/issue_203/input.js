var m = {};
var fn = Function("require", "module", "exports", "module.exports = 42;");
fn(null, m, m.exports);
console.log(m.exports);
