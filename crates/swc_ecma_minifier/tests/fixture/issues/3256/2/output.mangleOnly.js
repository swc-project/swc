const a = (a, b, c, d)=>{
    let e = (a & 0xffff) | 0, f = ((a >>> 16) & 0xffff) | 0, g = 0;
    while(c !== 0){
        g = c > 2000 ? 2000 : c;
        c -= g;
        do {
            e = (e + b[d++]) | 0;
            f = (f + e) | 0;
        }while (--g)
        e %= 65521;
        f %= 65521;
    }
    return e | (f << 16) | 0;
};
export default a;
