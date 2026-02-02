function n({ a = 4, b: c }) {}
function n([a, c = 12]) {}
var { x: n = 6, y: a } = n;
var [n, a = 6] = n;
