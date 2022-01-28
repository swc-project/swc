function f() {
    if (16 == code)
        var bitsLength = 2,
            bitsOffset = 3,
            what = len;
    else if (17 == code)
        var bitsLength = 3,
            bitsOffset = 3,
            what = (len = 0);
    else if (18 == code)
        var bitsLength = 7,
            bitsOffset = 11,
            what = (len = 0);
    var repeatLength = this.getBits(bitsLength) + bitsOffset;
}
