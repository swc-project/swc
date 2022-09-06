function e() {
    if (code == 16)
        var e = 2,
            i = 3,
            l = len;
    else if (code == 17)
        var e = 3,
            i = 3,
            l = (len = 0);
    else if (code == 18)
        var e = 7,
            i = 11,
            l = (len = 0);
    var n = this.getBits(e) + i;
}
