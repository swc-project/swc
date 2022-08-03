var fn = function(e) {
    switch(e){
        case 1:
            let l = e + 1;
            let t = e + 4;
            console.log(l, t);
            break;
        case 2:
            let a = e + 2;
            console.log(a);
            break;
        default:
            let c = e + 3;
            console.log(c);
    }
};
fn(1);
fn(2);
fn(3);
