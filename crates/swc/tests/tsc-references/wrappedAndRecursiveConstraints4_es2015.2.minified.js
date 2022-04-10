new class {
    foo(x1) {
        function bar(x) {
            return x;
        }
        return bar;
    }
    constructor(x){}
}({
    length: 2
}).foo('')({
    length: 3,
    charAt (x) {}
});
