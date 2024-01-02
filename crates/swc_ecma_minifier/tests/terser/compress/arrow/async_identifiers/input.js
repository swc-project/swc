var async = function (x) {
    console.log("async", x);
};
var await = function (x) {
    console.log("await", x);
};
async(1);
// prettier-ignore
await(2);
