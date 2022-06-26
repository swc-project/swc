for(let a = 9, b = 0; b < 20; b += a){
    let c = a++ + b;
    console.log(a, c, b);
    for(let d = c, e = c * c, f = 0; f < 10; f++){
        console.log(a, c, e, d, f);
    }
}
