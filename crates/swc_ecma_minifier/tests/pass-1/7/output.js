function foo(i) {
    var a;
    return (a = i()).x() + a.y();
}
export { foo };
