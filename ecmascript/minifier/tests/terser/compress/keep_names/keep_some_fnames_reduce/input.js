function foo() {
    var array = [];
    function bar() {}
    array.map(bar);
    function barElement() {}
    array.map(barElement);
    var aElement = () => {};
    array.map(aElement);
    array.map(aElement);
    var bElement = function () {};
    array.map(bElement);
    array.map(bElement);
}
