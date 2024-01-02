var o = function(o) {
    console.log("async", o);
};
var a = function(o) {
    console.log("await", o);
};
o(1);
await 2;
