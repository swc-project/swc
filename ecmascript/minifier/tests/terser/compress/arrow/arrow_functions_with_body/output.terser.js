var a1 = () => {
    var a = 42 * Math.random();
    return a;
};
var a2 = (p) => {
    var a = Math.random() * p;
    return a;
};
var a3 = (p) => {
    var a = Math.random() * p;
    return a;
};
var a4 = (...p) => {
    var a = Math.random() * p;
    return a;
};
var a5 = (b, c) => {
    var result = b * c + b / c;
    return result;
};
var a6 = (b, ...c) => {
    var result = b;
    for (var i = 0; i < c.length; i++) result += c[i];
    return result;
};
var a7 = (...b) => {
    b.join();
};
