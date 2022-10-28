const r = new RegExp('a', 'g');
!function(str, r) {
    let m;
    for(; m = r.exec(str);)console.log(m);
}('abcda', r);
