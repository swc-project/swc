!function(str, r) {
    let m;
    for(; m = r.exec(str);)console.log(m);
}('abcda', /a/g);
