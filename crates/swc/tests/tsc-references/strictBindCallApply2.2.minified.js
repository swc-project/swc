//// [strictBindCallApply2.ts]
// Repro from #32964
(function() {}).bind({
    blub: "blub"
});
