function bar(x) {
    if (1 === x) throw Error();
}
bar(3), bar(2), bar(1);
