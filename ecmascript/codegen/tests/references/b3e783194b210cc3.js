var a;
// compress these

a = true     || b;
a = 1        || c.d("a");
a = 2 * 3    || 4 * b;
a = 5 == 6   || b + 7;
a = "e" || 8 - b;
a = 9 + ""   || b / 10;
a = -4.5     || 11 << b;
a = 12        || 13;

a = false     || b;
a = 14         || c.d("f");
a = NaN       || c.d("g");
a = h || 15 * b;
a = null      || b + 16;
a = 17 * 18 - 19 || 20 - b;
a = 21 == 22   || b / 23;
a = !"e" || 24 % b;
a = null      || 25;

a = c.d(h && b || null);
a = c.d(h || b && null);

// don't compress these

a = b        || true;
a = c.d("a") || 26;
a = 27 - b    || "e";
a = 28 << b   || -4.5;

a = b        || false;
a = c.d("f") || NaN;
a = c.d("g") || 29;
a = 30 * b    || h;
a = b + 31    || null;
