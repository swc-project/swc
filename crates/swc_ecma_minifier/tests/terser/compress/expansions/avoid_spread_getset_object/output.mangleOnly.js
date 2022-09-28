let e = {
    ...{
        get x () {
            return 1;
        }
    }
};
let l = {
    ...{
        set y (_){
            console.log(_);
        }
    }
};
console.log(e.x, l.y, (e.x = 2), (l.y = 3), e.x, l.y);
