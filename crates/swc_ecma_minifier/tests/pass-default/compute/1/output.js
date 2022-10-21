console.log((function() {
    var b = 0;
    return b |= 94, b <<= 8, b |= 173, b <<= 8, b |= 190, b <<= 8, b |= 239;
})().toString(16));
