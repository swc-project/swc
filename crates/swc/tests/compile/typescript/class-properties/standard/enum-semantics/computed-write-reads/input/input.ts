const enum Keys { Zero = 0, One = 1 }
let extracted;
({ [Keys.Zero]: extracted } = { 0: 3 });
let fromLoop;
for ({ [Keys.Zero]: fromLoop = Keys.One } of [{}]) {}
const updated = [1];
updated[Keys.Zero] += 2;
++updated[Keys.Zero];
updated[Keys.Zero]--;
const sequenceDelete = delete (0, Keys.Zero);
const conditionalDelete = delete (globalThis.choice ? Keys.Zero : Keys.One);
const typedSequenceDelete = delete ((0, Keys.Zero) as any);

class Base {}
class Derived extends Base {
    assign() {
        super[Keys.Zero] = 3;
    }
}
const derived = new Derived();
derived.assign();

const enum Targets { A = 0, B = 1, C = 0, D = 1, E = 2 }
[Targets.A, ...Targets.B] = [3, 4, 5];
Targets.C ||= 5;
Targets.C &&= 7;
Targets.C ??= 9;
++(Targets.D as any);
delete (Targets.E as any);
for (Targets.A of [2, 3]) {}
for (Targets.D in { key: true }) {}
