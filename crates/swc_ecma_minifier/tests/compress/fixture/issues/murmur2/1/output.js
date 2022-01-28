export default function murmur2(str) {
    for(var k, h = 0, i = 0, len = str.length; len >= 4; ++i, len -= 4)k = (65535 & (k = 255 & str.charCodeAt(i) | (255 & str.charCodeAt(++i)) << 8 | (255 & str.charCodeAt(++i)) << 16 | (255 & str.charCodeAt(++i)) << 24)) * 1540483477 + ((k >>> 16) * 59797 << 16), k ^= k >>> 24, h = (65535 & k) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ (65535 & h) * 1540483477 + ((h >>> 16) * 59797 << 16);
    switch(len){
        case 3:
            h ^= (255 & str.charCodeAt(i + 2)) << 16;
        case 2:
            h ^= (255 & str.charCodeAt(i + 1)) << 8;
        case 1:
            h = (65535 & (h ^= 255 & str.charCodeAt(i))) * 1540483477 + ((h >>> 16) * 59797 << 16);
    }
    return (((h = (65535 & (h ^= h >>> 13)) * 1540483477 + ((h >>> 16) * 59797 << 16)) ^ h >>> 15) >>> 0).toString(36);
};
