export function foo(i) {
    var a, b;
    return (a = i()), (b = a), b.x() + b.y();
}
