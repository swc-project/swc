export default function murmur2(str) {
    for(// 'm' and 'r' are mixing constants generated offline.
    // They're not really 'magic', they just happen to work well.
    // const m = 0x5bd1e995;
    // const r = 24;
    // Initialize the hash
    var k, h = 0, i = 0, len = str.length; len >= 4; ++i, len -= 4)k = /* Math.imul(k, m): */ (0xffff & (k = 0xff & str.charCodeAt(i) | (0xff & str.charCodeAt(++i)) << 8 | (0xff & str.charCodeAt(++i)) << 16 | (0xff & str.charCodeAt(++i)) << 24)) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16), k ^= /* k >>> r: */ k >>> 24, h = (0xffff & k) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^ /* Math.imul(h, m): */ (0xffff & h) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
     // Handle the last few bytes of the input array
    switch(len){
        case 3:
            h ^= (0xff & str.charCodeAt(i + 2)) << 16;
        case 2:
            h ^= (0xff & str.charCodeAt(i + 1)) << 8;
        case 1:
            h ^= 0xff & str.charCodeAt(i), h = /* Math.imul(h, m): */ (0xffff & h) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
    } // Do a few final mixes of the hash to ensure the last few
    return(// bytes are well-incorporated.
    h ^= h >>> 13, (((h = /* Math.imul(h, m): */ (0xffff & h) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16)) ^ h >>> 15) >>> 0).toString(36));
}
