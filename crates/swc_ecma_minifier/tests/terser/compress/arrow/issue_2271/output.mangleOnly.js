var t = function () {};
t.prototype.set = function (t) {
    this.value = t;
    return this;
};
t.prototype.print = function () {
    console.log(this.value);
};
new t().set("PASS").print();
