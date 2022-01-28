let x = 0;
class WithStaticProps {
    static prop = (x = 0 === x ? 1 : "FAIL");
}
new (class {})();
new (class {
    prop = (x = 1 === x ? "PASS" : "FAIL");
})();
new WithStaticProps();
console.log(x);
