const obj = {
    Foo () {
        this.bar = "bar";
    }
};
new obj.Foo().bar;
