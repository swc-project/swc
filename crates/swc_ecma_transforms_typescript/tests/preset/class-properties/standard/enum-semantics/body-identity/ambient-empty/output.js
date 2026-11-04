var Ambient = /*#__PURE__*/ function(Ambient) {
    Ambient[Ambient["B"] = 2] = "B";
    return Ambient;
}(Ambient || {});
(function(Ambient) {
    Ambient[Ambient["C"] = 3] = "C";
})(Ambient);
var Empty = /*#__PURE__*/ function(Empty) {
    return Empty;
}(Empty || {});
(function(Empty) {
    Empty[Empty["A"] = 4] = "A";
})(Empty);
(function(Empty) {})(Empty);
(function(Empty) {
    Empty[Empty["B"] = 5] = "B";
})(Empty);
function make() {
    let Local = /*#__PURE__*/ function(Local) {
        Local[Local["A"] = 8] = "A";
        return Local;
    }({});
    (function(Local) {
        Local[Local["B"] = 9] = "B";
    })(Local);
    return [
        7,
        Reflect.get(Local, "A"),
        Reflect.get(Local, "B")
    ];
}
console.log(Reflect.get(Ambient, "B"), Reflect.get(Ambient, "C"));
console.log(Reflect.get(Empty, "A"), Reflect.get(Empty, "B"));
console.log(make());
