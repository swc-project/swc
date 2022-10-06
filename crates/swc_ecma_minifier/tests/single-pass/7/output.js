export function foo(i) {
    var a, b;
    return (a = i()).x() + a.y();
}
