//// [constAssertions.ts]
id(1);
function ff2(x, y) {
    return `${x}-${y}`;
}
ff2('foo', 'bar');
ff2('foo', '0');
ff2('top', 'left');
