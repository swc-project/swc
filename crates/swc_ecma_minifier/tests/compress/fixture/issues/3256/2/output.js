export default ((adler, buf, len, pos)=>{
    let s1 = 0xffff & adler | 0, s2 = adler >>> 16 & 0xffff | 0, n = 0;
    for(; 0 !== len;){
        len -= n = len > 2000 ? 2000 : len;
        do s2 = s2 + (s1 = s1 + buf[pos++] | 0) | 0;
        while (--n)
        s1 %= 65521, s2 %= 65521;
    }
    return s1 | s2 << 16 | 0;
});
