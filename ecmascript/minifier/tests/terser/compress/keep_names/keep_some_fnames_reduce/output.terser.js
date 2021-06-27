function foo() {
    var a = [];
    a.map(function () {});
    a.map(function barElement() {});
    var aElement = () => {};
    a.map(aElement);
    a.map(aElement);
    var bElement = function () {};
    a.map(bElement);
    a.map(bElement);
}
