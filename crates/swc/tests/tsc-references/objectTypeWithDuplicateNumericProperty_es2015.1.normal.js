// numeric properties must be distinct after a ToNumber operation
// so the below are all errors
class C {
}
var a;
var b = {
    1: 1,
    1: 1,
    1: 1,
    1: 1
};
