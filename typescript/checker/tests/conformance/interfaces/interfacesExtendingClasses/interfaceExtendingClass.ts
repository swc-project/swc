class Foo {
    x: string;
    y() { }
    get Z() {
        return 1;
    }
    [x: string]: Object;
}

interface I extends Foo {
}

var i: I;
var r1 = i.x;
var r2 = i.y();
var r3 = i.Z;

var f: Foo = i;
i = f;