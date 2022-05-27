function a() {
    if (code == 16) var a = 2, b = 3, c = len;
    else if (code == 17) var a = 3, b = 3, c = (len = 0);
    else if (code == 18) var a = 7, b = 11, c = (len = 0);
    var d = this.getBits(a) + b;
}
