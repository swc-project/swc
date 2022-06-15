export default function a(a) {
    var b = 0;
    var c, d = 0, e = a.length;
    for(; e >= 4; ++d, e -= 4){
        c = (a.charCodeAt(d) & 0xff) | ((a.charCodeAt(++d) & 0xff) << 8) | ((a.charCodeAt(++d) & 0xff) << 16) | ((a.charCodeAt(++d) & 0xff) << 24);
        c = (c & 0xffff) * 0x5bd1e995 + (((c >>> 16) * 0xe995) << 16);
        c ^= c >>> 24;
        b = ((c & 0xffff) * 0x5bd1e995 + (((c >>> 16) * 0xe995) << 16)) ^ ((b & 0xffff) * 0x5bd1e995 + (((b >>> 16) * 0xe995) << 16));
    }
    switch(e){
        case 3:
            b ^= (a.charCodeAt(d + 2) & 0xff) << 16;
        case 2:
            b ^= (a.charCodeAt(d + 1) & 0xff) << 8;
        case 1:
            b ^= a.charCodeAt(d) & 0xff;
            b = (b & 0xffff) * 0x5bd1e995 + (((b >>> 16) * 0xe995) << 16);
    }
    b ^= b >>> 13;
    b = (b & 0xffff) * 0x5bd1e995 + (((b >>> 16) * 0xe995) << 16);
    return ((b ^ (b >>> 15)) >>> 0).toString(36);
};
function b(a) {
    return a != null && typeof a !== "boolean";
}
