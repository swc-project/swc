function f() {
    if (code == 16)
        var bitsLength = 2,
            bitsOffset = 3,
            what = len;
    else if (code == 17)
        var bitsLength = 3,
            bitsOffset = 3,
            what = (len = 0);
    else if (code == 18)
        var bitsLength = 7,
            bitsOffset = 11,
            what = (len = 0);
    var repeatLength = this.getBits(bitsLength) + bitsOffset;
}
