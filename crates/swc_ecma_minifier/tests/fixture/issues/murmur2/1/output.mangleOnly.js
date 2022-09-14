export default function t(t) {
    var e = 0;
    var r, o = 0, a = t.length;
    for(; a >= 4; ++o, a -= 4){
        r = (t.charCodeAt(o) & 0xff) | ((t.charCodeAt(++o) & 0xff) << 8) | ((t.charCodeAt(++o) & 0xff) << 16) | ((t.charCodeAt(++o) & 0xff) << 24);
        r = (r & 0xffff) * 0x5bd1e995 + (((r >>> 16) * 0xe995) << 16);
        r ^= r >>> 24;
        e = ((r & 0xffff) * 0x5bd1e995 + (((r >>> 16) * 0xe995) << 16)) ^ ((e & 0xffff) * 0x5bd1e995 + (((e >>> 16) * 0xe995) << 16));
    }
    switch(a){
        case 3:
            e ^= (t.charCodeAt(o + 2) & 0xff) << 16;
        case 2:
            e ^= (t.charCodeAt(o + 1) & 0xff) << 8;
        case 1:
            e ^= t.charCodeAt(o) & 0xff;
            e = (e & 0xffff) * 0x5bd1e995 + (((e >>> 16) * 0xe995) << 16);
    }
    e ^= e >>> 13;
    e = (e & 0xffff) * 0x5bd1e995 + (((e >>> 16) * 0xe995) << 16);
    return ((e ^ (e >>> 15)) >>> 0).toString(36);
}
function e(t) {
    return t != null && typeof t !== "boolean";
}
