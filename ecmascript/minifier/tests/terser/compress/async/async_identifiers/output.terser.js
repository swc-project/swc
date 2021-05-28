var async = function (x) {
    console.log("async", x);
};
var await = function (x) {
    console.log("await", x);
};
async(1);
await 2;
