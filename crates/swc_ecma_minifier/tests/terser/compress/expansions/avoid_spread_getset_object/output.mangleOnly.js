let a = {
    ...{
        get x () {
            return 1;
        }
    }
};
let b = {
    ...{
        set y (_){
            console.log(_);
        }
    }
};
console.log(a.x, b.y, (a.x = 2), (b.y = 3), a.x, b.y);
