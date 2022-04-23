let x = 0;
class NoProps {}
class WithProps {
    prop = (x = x === 1 ? "PASS" : "FAIL");
}
class WithStaticProps {
    static prop = (x = x === 0 ? 1 : "FAIL");
}
new NoProps();
new WithProps();
new WithStaticProps();
console.log(x);
