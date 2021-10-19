var NUMBER, M, NUMBER1 = [
    1,
    2
];
function foo() {
    return 1;
}
class A {
    static foo() {
        return 1;
    }
}
(function(M) {
    var n;
    M.n = n;
})(M || (M = {
})), new A(), --NUMBER1, NUMBER1--, --1, --{
    x: 1,
    y: 2
}, --{
    x: 1,
    y: (n)=>n
}, 1--, {
    x: 1,
    y: 2
}--, {
    x: 1,
    y: (n)=>n
}--, --foo(), --A.foo(), --NUMBER + NUMBER, foo()--, A.foo()--, NUMBER + NUMBER--, --1, --NUMBER1, --foo(), 1--, NUMBER1--, foo()--;
