new RegExp("abc");
new RegExp("abc", "u");
RegExp("abc");
RegExp("abc", "u");
new RegExp("\\d\\d\\.\\d\\d\\.\\d\\d\\d\\d");
RegExp(`^\\d\\.$`);
new RegExp(String.raw`^\d\.$`);
/abc/;
/abc/u;
/\d\d\.\d\d\.\d\d\d\d/;
/^\d\.$/;
new RegExp(pattern);
RegExp("abc", flags);
new RegExp(prefix + "abc");
RegExp(`${prefix}abc`);
new RegExp(String.raw`^\d\. ${suffix}`);
function f1() {
    class RegExp {
        constructor(a, b) {}
    }

    new RegExp("a", "b");
}

new RegExp(/redundant/);

const obj = {
    RegExp,
};

console.log(RegExp);

((a, b) => {
    RegExp;
})("a", "b");

foo(() => {
    new RegExp("a");
})("a", "b");

new RegExp("a", "b", "c");

new RegExp(myFn`^\d\.$`);

new RegExp(obj.myFn`^\d\.$`)

function f2() {
    // redeclare
    const String = {};

    new RegExp(String.raw`^\d\.$`);
}
