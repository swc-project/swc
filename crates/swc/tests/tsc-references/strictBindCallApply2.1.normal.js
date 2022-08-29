//// [strictBindCallApply2.ts]
// Repro from #32964
function fn() {}
var fb = fn.bind({
    blub: "blub"
});
