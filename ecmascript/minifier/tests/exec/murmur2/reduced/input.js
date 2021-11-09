function murmur2(str) {
    var h = 0;
    var k, i = 0, len = str.length;
    for (; len >= 4; ++i, len -= 4) {
        k = 255 & str.charCodeAt(i) | (255 & str.charCodeAt(++i)) << 8 | (255 & str.charCodeAt(++i)) << 16 | (255 & str.charCodeAt(++i)) << 24;
        k = (65535 & k) * 1540483477 + ((k >>> 16) * 59797 << 16);
        k ^= k >>> 24;
        h = (65535 & k) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ (65535 & h) * 1540483477 + ((h >>> 16) * 59797 << 16);
    }
    switch (len) {
        case 3:
            h ^= (255 & str.charCodeAt(i + 2)) << 16;
        case 2:
            h ^= (255 & str.charCodeAt(i + 1)) << 8;
        case 1:
            h ^= 255 & str.charCodeAt(i);
            h = (65535 & h) * 1540483477 + ((h >>> 16) * 59797 << 16);
    }
    h ^= h >>> 13;
    h = (65535 & h) * 1540483477 + ((h >>> 16) * 59797 << 16);
    return ((h ^ h >>> 15) >>> 0).toString(36);
}
console.log(murmur2("123421334"));
console.log(murmur2("123asd ;nv"));
console.log(murmur2("1va1ns`klj"));