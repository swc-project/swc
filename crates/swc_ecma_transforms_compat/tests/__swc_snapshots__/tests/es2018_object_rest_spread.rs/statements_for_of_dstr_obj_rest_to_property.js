var _ref;
var src = {};
var counter = 0;
for (_ref of [
    {
        x: 1,
        y: 2
    }
]){
    ({} = _ref), src.y = _extends({}, _ref), _ref;
    expect(src.y.x).toEqual(1);
    expect(src.y.y).toEqual(2);
    counter += 1;
}
expect(counter).toEqual(1);
