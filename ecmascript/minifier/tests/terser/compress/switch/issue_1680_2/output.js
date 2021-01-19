var a = 100,
    b = 10;
switch (b) {
    case a--:
        break;
    case b:
        var c;
        break;
    case a:
    case a--:
}
console.log(a, b);
