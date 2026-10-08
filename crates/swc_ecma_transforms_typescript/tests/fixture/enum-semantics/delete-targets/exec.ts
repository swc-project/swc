namespace Fixture {
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

expect(Object.hasOwn(Values.E, "Dot")).toBe(false);
expect(Object.hasOwn(Values.E, "Computed")).toBe(false);
expect(Object.hasOwn(Values.E, "Grouped")).toBe(false);
expect(Object.hasOwn(Values.E, "Optional")).toBe(false);
expect(Object.hasOwn(Values.ConstE, "A")).toBe(false);
expect(Object.hasOwn(object, "0")).toBe(false);
expect(Object.hasOwn(object, "1")).toBe(false);
expect(Object.hasOwn(receivers[0], "value")).toBe(false);
expect(Object.is(negative, -0)).toBe(true);
}
