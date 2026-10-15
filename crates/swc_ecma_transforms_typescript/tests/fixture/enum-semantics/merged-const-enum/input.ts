const enum Merged { A = 1 }
const enum Merged { B = 2 }
const enum Dependent { A = 3 }
const enum Dependent { B = Dependent.A + 1 }

const enum Unknown { A = 5 }
const enum Unknown { B = runtime() }
const enum ReverseUnknown { A = runtime() }
const enum ReverseUnknown { B = 7 }
function runtime() { return 6; }

const enum ObjectUse { A = 8 }
const enum ObjectUse { B = 9 }
const object = ObjectUse;
const enum Writes { A = 10 }
const enum Writes { B = 11 }
Writes.B = 12;

namespace NamespaceOnly {
    const enum E { A = 13 }
    const enum E { B = 14 }
}
const observed = [Merged.A, Merged.B, Dependent.A, Dependent.B,
    Unknown.A, Unknown.B, ReverseUnknown.A, ReverseUnknown.B];
