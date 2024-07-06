// real life example taken from https://github.com/nodeca/pako/blob/master/lib/zlib/adler32.js#L26
export default ((adler, buf, len, pos)=>{
    let s1 = 0xffff & adler | 0, s2 = adler >>> 16 & 0xffff | 0, n = 0;
    for(; 0 !== len;){
        // Set limit ~ twice less than 5552, to keep
        // s2 in 31-bits, because we force signed ints.
        // in other case %= will fail.
        n = len > 2000 ? 2000 : len, len -= n;
        do s2 = s2 + (s1 = s1 + buf[pos++] | 0) | 0;
        while (--n)
        s1 %= 65521, s2 %= 65521;
    }
    return s1 | s2 << 16 | 0;
});
