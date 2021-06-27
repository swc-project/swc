var A = 1;
var B = {
    get c() {
        console.log(A);
    },
};
B.c;
