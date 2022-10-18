console.log((function () {
    var a = [
        94,
        173,
        190,
        239
    ], b = 0;
    return b |= 94, b <<= 8, b |= 173, b <<= 8, b |= 190, b <<= 8, b |= 239;
})().toString(16));