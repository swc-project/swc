var src = {};
var counter = 0;
for (var _ref of [
    {
        x: 1,
        y: 2
    }
]){
    var _ref1;
    _ref1 = _ref, src.y = _extends({}, _object_destructuring_empty(_ref1)), _ref1;
    expect(src.y.x).toEqual(1);
    expect(src.y.y).toEqual(2);
    counter += 1;
}
expect(counter).toEqual(1);
