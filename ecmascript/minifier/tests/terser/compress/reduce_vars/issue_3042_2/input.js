function Foo() {
    this.isFoo = function (o) {
        return o instanceof Foo;
    };
}
function FooCollection() {
    this.foos = [1, 1].map(function () {
        return new Foo();
    });
}
var fooCollection = new FooCollection();
console.log(fooCollection.foos[0].isFoo(fooCollection.foos[0]));
console.log(fooCollection.foos[0].isFoo(fooCollection.foos[1]));
console.log(fooCollection.foos[1].isFoo(fooCollection.foos[0]));
console.log(fooCollection.foos[1].isFoo(fooCollection.foos[1]));
