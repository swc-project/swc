//// [example.js]
new ({
    Foo: function() {
        this.bar = "bar";
    }
}).Foo().bar;
