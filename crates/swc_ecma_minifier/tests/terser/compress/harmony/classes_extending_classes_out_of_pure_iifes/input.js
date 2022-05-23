let Base = (() => {
    class A {}
    A.sub = Sub;
    return A;
})();
class Sub extends Base {}
