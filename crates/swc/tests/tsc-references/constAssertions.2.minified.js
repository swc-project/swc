//// [constAssertions.ts]
function ff2(x, y) {
    return `${x}-${y}`;
}
id(1), ff2('foo', 'bar'), ff2('foo', '0'), ff2('top', 'left');
