declare enum Ambient { A = 1 }
enum Ambient { B = 2 }
enum Ambient { C = 3 }
enum Empty {}
enum Empty { A = 4 }
enum Empty {}
enum Empty { B = 5 }
declare namespace Types { enum E { A = 6 } }
function make() {
    const enum Erased { Value = 7 }
    enum Local { A = 8 }
    enum Local { B = 9 }
    return [Erased.Value, Reflect.get(Local, "A"), Reflect.get(Local, "B")];
}
expect(Reflect.get(Ambient, "B")).toBe(2);
expect(Reflect.get(Ambient, "C")).toBe(3);
expect(Reflect.get(Empty, "A")).toBe(4);
expect(Reflect.get(Empty, "B")).toBe(5);
expect(make()).toEqual([7, 8, 9]);
