const f = function(a = void 0) {
    a = 1;
    return arguments[0];
};
function* g(a = undefined) {
    a = 1;
    yield arguments[0];
}
async function h(a = undefined) {
    a = 1;
    return arguments[0];
}
console.log(f(2), f.length);
console.log(g(2).next().value, g.length);
h(2).then(value => console.log(value, h.length));
