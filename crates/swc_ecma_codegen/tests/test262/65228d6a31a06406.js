var a;
// compress these
a = true && b;
a = 1 && c.d("a");
a = 2 * 3 && 4 * b;
a = 5 == 6 && b + 7;
a = "e" && 8 - b;
a = 9 + "" && b / 10;
a = -4.5 && 11 << b;
a = 12 && 13;
a = false && b;
a = NaN && c.d("f");
a = 14 && c.d("g");
a = h && 15 * b;
a = null && b + 16;
a = 17 * 18 - 19 && 20 - b;
a = 21 == 22 && b / 23;
a = !"e" && 24 % b;
a = 25 && 26;
// don't compress these
a = b && true;
a = c.d("a") && 27;
a = 28 - b && "e";
a = 29 << b && -4.5;
a = b && false;
a = c.d("f") && NaN;
a = c.d("g") && 30;
a = 31 * b && h;
a = b + 32 && null;
