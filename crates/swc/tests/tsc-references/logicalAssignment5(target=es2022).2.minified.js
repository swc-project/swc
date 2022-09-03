//// [logicalAssignment5.ts]
function foo1(f) {
    (f ??= (a)=>a)(42);
}
function foo2(f) {
    (f ||= (a)=>a)(42);
}
function foo3(f) {
    (f &&= (a)=>a)(42);
}
function bar1(f) {
    (f ??= (f.toString(), (a)=>a))(42);
}
function bar2(f) {
    (f ||= (f.toString(), (a)=>a))(42);
}
function bar3(f) {
    (f &&= (f.toString(), (a)=>a))(42);
}
