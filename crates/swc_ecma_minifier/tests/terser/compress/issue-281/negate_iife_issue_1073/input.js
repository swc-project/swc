new ((function (a) {
    return function Foo() {
        this.x = a;
        console.log(this);
    };
})(7))();
