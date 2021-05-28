var fn = function (e) {
    switch (e) {
        case 1:
            let l = e + 1;
            let o = e + 4;
            console.log(l, o);
            break;
        case 2:
            let n = e + 2;
            console.log(n);
            break;
        default:
            let c = e + 3;
            console.log(c);
    }
};
fn(1);
fn(2);
fn(3);
