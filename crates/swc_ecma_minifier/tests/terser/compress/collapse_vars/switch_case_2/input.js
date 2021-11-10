var a = 1,
    b = 2;
switch (b++) {
    case b:
        var c = a;
        var a;
        break;
}
console.log(a);
