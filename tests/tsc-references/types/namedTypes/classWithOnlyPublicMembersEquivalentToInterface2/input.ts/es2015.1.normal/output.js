// @target: es5
// no errors expected
class C {
    y(a) {
        return null;
    }
    get z() {
        return 1;
    }
    set z(v) {
    }
}
var c;
var i;
c = i;
i = c;
