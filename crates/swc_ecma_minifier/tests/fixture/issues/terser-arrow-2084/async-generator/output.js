(async (c)=>{
    c++, c = 0, console.log(await Promise.resolve(c));
})(1);
var iter = function*(c) {
    c++, c = 0, yield c;
}(1);
console.log(iter.next().value);
