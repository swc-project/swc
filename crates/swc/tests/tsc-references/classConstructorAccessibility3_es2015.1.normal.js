// @declaration: true
class Foo {
    constructor(x){
        this.x = x;
    }
}
class Bar {
    constructor(x){
        this.x = x;
    }
}
class Baz {
    constructor(x){
        this.x = x;
    }
}
class Qux {
    constructor(x){
        this.x = x;
    }
}
// b is public
let a = Foo;
a = Bar;
a = Baz; // error Baz is protected
a = Qux; // error Qux is private
// b is protected
let b = Baz;
b = Foo;
b = Bar;
b = Qux; // error Qux is private
// c is private
let c = Qux;
c = Foo;
c = Bar;
c = Baz;
