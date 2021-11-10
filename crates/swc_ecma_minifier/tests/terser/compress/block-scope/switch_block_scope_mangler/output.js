var fn = function(a) {
    switch(a){
        case 1:
            let b = a + 1;
            let c = a + 4;
            console.log(b, c);
            break;
        case 2:
            let d = a + 2;
            console.log(d);
            break;
        default:
            let e = a + 3;
            console.log(e);
    }
};
fn(1);
fn(2);
fn(3);
