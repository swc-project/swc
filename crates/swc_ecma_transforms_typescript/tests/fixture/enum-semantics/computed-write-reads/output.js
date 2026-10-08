let extracted;
({ [0]: extracted } = {
    0: 3
});
let fromLoop;
for ({ [0]: fromLoop = 1 } of [
    {}
]){}
const updated = [
    1
];
updated[0] += 2;
++updated[0];
updated[0]--;
const sequenceDelete = delete (0, 0);
const conditionalDelete = delete (globalThis.choice ? 0 : 1);
const typedSequenceDelete = delete (0, 0);
class Base {
}
class Derived extends Base {
    assign() {
        super[0] = 3;
    }
}
const derived = new Derived();
derived.assign();
var Targets = /*#__PURE__*/ function(Targets) {
    Targets[Targets["A"] = 0] = "A";
    Targets[Targets["B"] = 1] = "B";
    Targets[Targets["C"] = 0] = "C";
    Targets[Targets["D"] = 1] = "D";
    Targets[Targets["E"] = 2] = "E";
    return Targets;
}(Targets || {});
[Targets.A, ...Targets.B] = [
    3,
    4,
    5
];
Targets.C ||= 5;
Targets.C &&= 7;
Targets.C ??= 9;
++Targets.D;
delete Targets.E;
for (Targets.A of [
    2,
    3
]){}
for(Targets.D in {
    key: true
}){}
