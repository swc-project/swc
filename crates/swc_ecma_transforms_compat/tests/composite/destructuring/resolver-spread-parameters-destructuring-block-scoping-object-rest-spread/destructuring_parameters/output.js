function somethingAdvanced(param, p2, p3) {
    var tmp = param.topLeft, _ref = tmp === void 0 ? {} : tmp, x1 = _ref.x, y1 = _ref.y, tmp1 = param.bottomRight, _ref1 = tmp1 === void 0 ? {} : tmp1, x2 = _ref1.x, y2 = _ref1.y;
}
function unpackObject(param) {
    var title = param.title, author = param.author;
    return title + " " + author;
}
console.log(unpackObject({
    title: "title",
    author: "author"
}));
var unpackArray = function(param, param1) {
    var _param = _sliced_to_array(param, 3), a = _param[0], b = _param[1], c = _param[2], _param1 = _sliced_to_array(param1, 3), x = _param1[0], y = _param1[1], z = _param1[2];
    return a + b + c;
};
console.log(unpackArray([
    "hello",
    " ",
    "world"
], [
    1,
    2,
    3
]));
