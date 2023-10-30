{
    let fn1 = function fn1() {
        fn2();
    };
    let fn2 = function fn2() {};
    fn1();
}
