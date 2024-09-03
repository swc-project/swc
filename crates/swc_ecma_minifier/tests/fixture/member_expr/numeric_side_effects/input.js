let foo = 1;
const obj = {
    get 1() {
        // same with get "1"()
        foo = 2;
        return 40;
    },
};
obj["1"]; // same with obj[1]
console.log(foo);
