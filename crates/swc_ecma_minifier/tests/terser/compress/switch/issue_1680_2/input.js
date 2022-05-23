var a = 100,
    b = 10;
switch (b) {
    case a--:
        break;
    case b:
        var c;
        break;
    case a:
        break;
    case a--:
        break;
}
console.log(a, b);
