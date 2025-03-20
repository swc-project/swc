var a = "PASS";
for(var k in "12"){
    var b = void 0;
    (b >>= 1) && (a = "FAIL"), b = 2;
}
console.log(a);
