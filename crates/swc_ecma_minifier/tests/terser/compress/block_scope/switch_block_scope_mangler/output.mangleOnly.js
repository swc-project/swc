var a = function(a) {
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
a(1);
a(2);
a(3);
