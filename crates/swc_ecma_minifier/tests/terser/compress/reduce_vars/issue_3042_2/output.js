function Foo() {
    this.isFoo = function(o) {
        return o instanceof Foo;
    };
}
var fooCollection = new function() {
    this.foos = [
        1,
        1
    ].map(function() {
        return new Foo();
    });
}();
console.log(fooCollection.foos[0].isFoo(fooCollection.foos[0]));
console.log(fooCollection.foos[0].isFoo(fooCollection.foos[1]));
console.log(fooCollection.foos[1].isFoo(fooCollection.foos[0]));
console.log(fooCollection.foos[1].isFoo(fooCollection.foos[1]));
