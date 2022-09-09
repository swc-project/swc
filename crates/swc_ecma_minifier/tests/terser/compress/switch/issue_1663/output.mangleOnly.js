var a = 100,
    c = 10;
function e() {
    switch (1) {
        case 1:
            c = a++;
            return ++c;
        default:
            var c;
    }
}
e();
console.log(a, c);
