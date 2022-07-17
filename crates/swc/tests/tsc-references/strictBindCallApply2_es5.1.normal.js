// @strictFunctionTypes: false
// @strictBindCallApply: true
// Repro from #32964
function fn() {}
var fb = fn.bind({
    blub: "blub"
});
