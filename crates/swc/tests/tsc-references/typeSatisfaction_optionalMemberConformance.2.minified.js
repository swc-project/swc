//// [typeSatisfaction_optionalMemberConformance.ts]
// Undesirable behavior today with type annotation
var a = {
    x: 10
};
// Should OK
console.log(a.x.toFixed()), a.y;
