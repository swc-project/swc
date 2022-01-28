var unused;
const CONST_FOO = false;
if (CONST_FOO) {
    console.log("unreachable");
    var moo;
    function bar() {}
}
