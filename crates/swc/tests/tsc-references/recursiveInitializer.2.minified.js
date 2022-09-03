//// [recursiveInitializer.ts]
var n1 = n1++, n2 = n2 + n2, n3 = n3 + n3, s1 = s1 + "", s2 = s2 + s2, s3 = s3 + s3, s4 = "" + s4, b1 = !b1, b2 = !!b2, b3 = !b3 || b3, b4 = !b4 && b4, f = function(x) {
    return f(x);
};
