for(let b = 9, c = 0; c < 20; c += b){
    let a = b++ + c;
    console.log(b, a, c);
    for(let e = a, f = a * a, d = 0; d < 10; d++){
        console.log(b, a, f, e, d);
    }
}
