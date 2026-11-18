namespace Values {
    export enum E { Dot = 1, Computed = 2, Grouped = 3, Optional = 4 }
    export const enum ConstE { A = 5 }
}
import Alias = Values.E;
delete Values.E.Dot;
delete Alias["Computed"];
delete (Values.E.Grouped);
delete Values.E?.Optional;
delete Values.ConstE.A;

const enum DeleteOnly { A = 1 }
delete DeleteOnly.A;

const enum Keys { Zero = 0 }
const object = { 0: true, 1: true };
delete object[Keys.Zero];
delete object[Keys.Zero + 1];
const receivers = [{ value: true }];
delete receivers[Keys.Zero].value;
const negative = -Keys.Zero;
