const a = (e, f, b, g)=>{
    let a = (e & 0xffff) | 0, c = ((e >>> 16) & 0xffff) | 0, d = 0;
    while(b !== 0){
        d = b > 2000 ? 2000 : b;
        b -= d;
        do {
            a = (a + f[g++]) | 0;
            c = (c + a) | 0;
        }while (--d)
        a %= 65521;
        c %= 65521;
    }
    return a | (c << 16) | 0;
};
export default a;
