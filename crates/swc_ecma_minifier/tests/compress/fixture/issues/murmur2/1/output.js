export default function murmur2(str) {
    for(var k, h = 0, i = 0, len = str.length; len >= 4; ++i, len -= 4)k = (0xffff & (k = 0xff & str.charCodeAt(i) | (0xff & str.charCodeAt(++i)) << 8 | (0xff & str.charCodeAt(++i)) << 16 | (0xff & str.charCodeAt(++i)) << 24)) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16), k ^= k >>> 24, h = (0xffff & k) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^ (0xffff & h) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
    switch(len){
        case 3:
            h ^= (0xff & str.charCodeAt(i + 2)) << 16;
        case 2:
            h ^= (0xff & str.charCodeAt(i + 1)) << 8;
        case 1:
            h ^= 0xff & str.charCodeAt(i), h = (0xffff & h) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
    }
    return h ^= h >>> 13, (((h = (0xffff & h) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16)) ^ h >>> 15) >>> 0).toString(36);
};
