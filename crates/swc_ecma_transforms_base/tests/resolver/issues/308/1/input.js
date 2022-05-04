function bar(props) {}
var Foo = function Foo1() {
    _classCallCheck(this, Foo1);
    super();
    _defineProperty(this, "onBar", () => {
        bar();
    });
    bar();
};
