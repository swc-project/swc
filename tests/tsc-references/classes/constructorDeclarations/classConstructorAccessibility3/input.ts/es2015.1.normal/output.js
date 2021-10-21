// @declaration: true
class Foo {
    constructor(x){
        this.x = x;
    }
}
class Bar {
    constructor(x1){
        this.x = x1;
    }
}
class Baz {
    constructor(x2){
        this.x = x2;
    }
}
class Qux {
    constructor(x3){
        this.x = x3;
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
