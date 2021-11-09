class Foo {
    y() {
    }
    get Z() {
        return 1;
    }
}
var i;
var r1 = i.x;
var r2 = i.y();
var r3 = i.Z;
var f = i;
i = f;
