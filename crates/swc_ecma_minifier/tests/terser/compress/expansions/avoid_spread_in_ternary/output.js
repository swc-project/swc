function print(...x) {
    console.log(...x);
}
var a = [1, 2],
    b = [3, 4],
    m = Math;
print(m ? a : b);
m ? print(...a) : print(b);
m.no_such_property ? print(a) : print(...b);
