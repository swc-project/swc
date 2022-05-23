var fn = function (code) {
    switch (code) {
        case 1:
            let apple = code + 1;
            let dog = code + 4;
            console.log(apple, dog);
            break;
        case 2:
            let banana = code + 2;
            console.log(banana);
            break;
        default:
            let cat = code + 3;
            console.log(cat);
    }
};
fn(1);
fn(2);
fn(3);
