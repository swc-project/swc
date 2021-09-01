let badfunc = ()=>{
};
function f1() {
    badfunc = function badfunc1() {
    };
    badfunc();
    f2();
}
function f2() {
    badfunc = ()=>{
    };
    f1();
}
