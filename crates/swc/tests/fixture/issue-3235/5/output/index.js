var res = [];
var a = 2;
res.push(a === 2);
{
    var b3 = 1;
}res.push(typeof b === "undefined");
if (true) {
    var b1 = 0;
}
res.push(typeof b === "undefined");
for(var b2 = 0; b2 < 10; b2++){}
res.push(typeof b === "undefined");
function test() {
    var b = 7;
}
res.push(typeof b === "undefined");
console.log(res);
