var b = 1;
do {
    console.log(((a = void 0), a ? "FAIL" : (a = "PASS")));
} while (b--);
var a;
