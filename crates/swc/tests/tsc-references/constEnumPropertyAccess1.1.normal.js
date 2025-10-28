//// [constEnumPropertyAccess1.ts]
var o = {
    1: true
};
var a = 1;
var a1 = 1;
var g = o[1];
class C {
    [1]() {}
    get [2]() {
        return true;
    }
    set [2](x) {}
}
