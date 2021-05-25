var async = (x) => {
    console.log("async", x);
};
var await = (x) => {
    console.log("await", x);
};
async(1);
await 2;
