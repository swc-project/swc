let x = {
    ...{
        get x() {
            return 1;
        },
    },
};
let y = {
    ...{
        set y(_) {
            console.log(_);
        },
    },
};
console.log(x.x, y.y, (x.x = 2), (y.y = 3), x.x, y.y);
