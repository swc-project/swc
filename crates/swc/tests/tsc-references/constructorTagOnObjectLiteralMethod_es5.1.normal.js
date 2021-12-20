// @noEmit: true
// @Filename: example.js
// @allowJs: true
// @checkJs: true
// @noImplicitAny: true
var obj = {
    /** @constructor */ Foo: function Foo() {
        this.bar = "bar";
    }
};
new obj.Foo().bar;
