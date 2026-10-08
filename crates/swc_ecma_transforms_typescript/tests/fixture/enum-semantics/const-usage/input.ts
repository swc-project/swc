const enum Gone { A = 1, B }
const folded = (Gone)[("B")];
const enum ObjectUse { A = 3, B = 4 }
const object = ObjectUse;
const enum Optional { A = 5, B }
const optional = Optional?.A;
const enum Dynamic { A = 6, B }
const key = "A";
const dynamic = Dynamic[key];
const enum Writes { A = 7, B = 8 }
({ value: Writes.A } = { value: 9 });
for (Writes.B of [10]) {}
const enum Mixed { A = 11, B = runtime() }
function runtime() { return 12; }
const mixed = Mixed;
const enum Merged { A = 13 }
const enum Merged { B = 14 }
const merged = [Merged.A, Merged.B];
namespace Empty { const enum E { A = 15 } }
