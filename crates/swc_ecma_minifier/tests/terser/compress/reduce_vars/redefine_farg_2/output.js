console.log(
    ((a = []), typeof a),
    "number",
    (function (a, b) {
        a = b;
        return typeof a;
    })([])
);
var a;
