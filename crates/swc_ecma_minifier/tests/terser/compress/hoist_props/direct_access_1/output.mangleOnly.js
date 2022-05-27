var a = 0;
var b = {
    a: 1,
    b: 2
};
for(var c in b)a++;
console.log(a, b.a);
