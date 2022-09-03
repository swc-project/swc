//// [newTargetNarrowing.ts]
function foo(x) {}
function f() {
    !0 === new.target.marked && foo(new.target.marked);
}
f.marked = !0;
