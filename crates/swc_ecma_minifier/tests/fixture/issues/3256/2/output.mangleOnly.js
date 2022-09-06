const e = (e, t, l, o)=>{
    let r = (e & 0xffff) | 0, d = ((e >>> 16) & 0xffff) | 0, h = 0;
    while(l !== 0){
        h = l > 2000 ? 2000 : l;
        l -= h;
        do {
            r = (r + t[o++]) | 0;
            d = (d + r) | 0;
        }while (--h)
        r %= 65521;
        d %= 65521;
    }
    return r | (d << 16) | 0;
};
export default e;
