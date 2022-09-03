//// [example.js]
var obj = {
    Foo: function() {
        this.bar = "bar";
    }
};
new obj.Foo().bar;
