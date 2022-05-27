export default function a(b) {
    var a = 0;
    var c, d = 0, e = b.length;
    for(; e >= 4; ++d, e -= 4){
        c = (b.charCodeAt(d) & 0xff) | ((b.charCodeAt(++d) & 0xff) << 8) | ((b.charCodeAt(++d) & 0xff) << 16) | ((b.charCodeAt(++d) & 0xff) << 24);
        c = (c & 0xffff) * 0x5bd1e995 + (((c >>> 16) * 0xe995) << 16);
        c ^= c >>> 24;
        a = ((c & 0xffff) * 0x5bd1e995 + (((c >>> 16) * 0xe995) << 16)) ^ ((a & 0xffff) * 0x5bd1e995 + (((a >>> 16) * 0xe995) << 16));
    }
    switch(e){
        case 3:
            a ^= (b.charCodeAt(d + 2) & 0xff) << 16;
        case 2:
            a ^= (b.charCodeAt(d + 1) & 0xff) << 8;
        case 1:
            a ^= b.charCodeAt(d) & 0xff;
            a = (a & 0xffff) * 0x5bd1e995 + (((a >>> 16) * 0xe995) << 16);
    }
    a ^= a >>> 13;
    a = (a & 0xffff) * 0x5bd1e995 + (((a >>> 16) * 0xe995) << 16);
    return ((a ^ (a >>> 15)) >>> 0).toString(36);
};
function b(a) {
    return a != null && typeof a !== "boolean";
}
