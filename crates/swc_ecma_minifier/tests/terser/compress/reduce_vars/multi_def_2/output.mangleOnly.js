function i() {
    if (code == 16) var i = 2, e = 3, _ = len;
    else if (code == 17) var i = 3, e = 3, _ = (len = 0);
    else if (code == 18) var i = 7, e = 11, _ = (len = 0);
    var a = this.getBits(i) + e;
}
