// @strictFunctionTypes: false
// @strictBindCallApply: true
// Repro from #32964
function fn() {}
const fb = fn.bind({
    blub: "blub"
});
