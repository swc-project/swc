let e = {
    ...{
        get x () {
            return 1;
        }
    }
};
let t = {
    ...{
        set y (_){
            console.log(_);
        }
    }
};
console.log(e.x, t.y, (e.x = 2), (t.y = 3), e.x, t.y);
