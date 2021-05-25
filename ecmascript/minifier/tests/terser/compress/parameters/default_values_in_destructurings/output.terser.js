function x({ a = 4, b }) {}
function x([b, c = 12]) {}
var { x = 6, y } = x;
var [x, y = 6] = x;
