var a = {
    [1 + 0]: 1,
    [2 + 0] () {
        this[4] = "PASS";
    },
    get [3 + 0] () {
        return this[1];
    },
    set [4 + 0] (value){
        this[1] = value;
    }
};
a[2]();
console.log(a[3]);
