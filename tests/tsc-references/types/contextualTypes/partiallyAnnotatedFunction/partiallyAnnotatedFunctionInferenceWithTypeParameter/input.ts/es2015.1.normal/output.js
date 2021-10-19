class C {
}
class D extends C {
}
// exactly
test((t1, t2)=>{
    t2.test2;
});
test((t1, t2)=>{
    t2.test2;
});
// zero arg
test(()=>{
});
// fewer args
test((t1)=>{
});
// rest arg
test((...ts)=>{
});
// source function has rest arg
testRest((t1)=>{
});
testRest((t1, t2, t3)=>{
});
testRest((t1, t2, t3)=>{
});
testRest((t1, t2, t3)=>{
});
testRest((t2, ...t3)=>{
});
testRest((t2, ...t3)=>{
});
