var a = function() {};
a.prototype.set = function(a) {
    this.value = a;
    return this;
};
a.prototype.print = function() {
    console.log(this.value);
};
new a().set("PASS").print();
