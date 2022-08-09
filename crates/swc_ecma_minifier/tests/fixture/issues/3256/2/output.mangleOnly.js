const $ = ($, f, e, t)=>{
    let l = ($ & 0xffff) | 0, _ = (($ >>> 16) & 0xffff) | 0, o = 0;
    while(e !== 0){
        o = e > 2000 ? 2000 : e;
        e -= o;
        do {
            l = (l + f[t++]) | 0;
            _ = (_ + l) | 0;
        }while (--o)
        l %= 65521;
        _ %= 65521;
    }
    return l | (_ << 16) | 0;
};
export default $;
