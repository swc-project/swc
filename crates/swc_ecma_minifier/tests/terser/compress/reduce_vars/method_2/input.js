var A = 1;
var B = class {
    c() {
        console.log(A);
    }
};
new B().c();
