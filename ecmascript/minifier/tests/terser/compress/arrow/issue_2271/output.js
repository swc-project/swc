var Foo = function () {};
Foo.prototype.set = function (value) {
    this.value = value;
    return this;
};
Foo.prototype.print = function () {
    console.log(this.value);
};
new Foo().set("PASS").print();
