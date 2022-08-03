for(let l = 9, o = 0; o < 20; o += l){
    let $ = l++ + o;
    console.log(l, $, o);
    for(let e = $, t = $ * $, f = 0; f < 10; f++){
        console.log(l, $, t, e, f);
    }
}
