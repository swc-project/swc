export default function f(f) {
    var e = 0;
    var $, x = 0, _ = f.length;
    for(; _ >= 4; ++x, _ -= 4){
        $ = (f.charCodeAt(x) & 0xff) | ((f.charCodeAt(++x) & 0xff) << 8) | ((f.charCodeAt(++x) & 0xff) << 16) | ((f.charCodeAt(++x) & 0xff) << 24);
        $ = ($ & 0xffff) * 0x5bd1e995 + ((($ >>> 16) * 0xe995) << 16);
        $ ^= $ >>> 24;
        e = (($ & 0xffff) * 0x5bd1e995 + ((($ >>> 16) * 0xe995) << 16)) ^ ((e & 0xffff) * 0x5bd1e995 + (((e >>> 16) * 0xe995) << 16));
    }
    switch(_){
        case 3:
            e ^= (f.charCodeAt(x + 2) & 0xff) << 16;
        case 2:
            e ^= (f.charCodeAt(x + 1) & 0xff) << 8;
        case 1:
            e ^= f.charCodeAt(x) & 0xff;
            e = (e & 0xffff) * 0x5bd1e995 + (((e >>> 16) * 0xe995) << 16);
    }
    e ^= e >>> 13;
    e = (e & 0xffff) * 0x5bd1e995 + (((e >>> 16) * 0xe995) << 16);
    return ((e ^ (e >>> 15)) >>> 0).toString(36);
};
function e(f) {
    return f != null && typeof f !== "boolean";
}
