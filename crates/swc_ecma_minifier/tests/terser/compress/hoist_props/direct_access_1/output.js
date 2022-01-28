var a = 0;
var obj = { a: 1, b: 2 };
for (var k in obj) a++;
console.log(a, obj.a);
