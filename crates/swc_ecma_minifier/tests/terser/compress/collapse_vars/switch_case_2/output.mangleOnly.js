var a = 1,
    r = 2;
switch (r++) {
    case r:
        var c = a;
        var a;
        break;
}
console.log(a);
