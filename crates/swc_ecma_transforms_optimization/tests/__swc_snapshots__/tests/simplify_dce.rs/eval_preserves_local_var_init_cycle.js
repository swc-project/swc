function outer(s) {
    var A = ()=>B();
    function B() {
        return A;
    }
    return eval(s);
}
outer('A');
