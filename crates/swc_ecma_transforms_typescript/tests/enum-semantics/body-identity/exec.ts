enum E { A = 1 }
enum E { B = 2 }
namespace N { export enum E { A = "a" } }
namespace N { export enum E { B = "b" } }
class Box {
    constructor(public value = (() => {
        enum Local { A = 3 }
        enum Local { B = 4 }
        return [Reflect.get(Local, "A"), Reflect.get(Local, "B")];
    })()) {}
}
expect(Reflect.get(E, "A")).toBe(1);
expect(Reflect.get(E, "B")).toBe(2);
expect(Reflect.get(N.E, "A")).toBe("a");
expect(Reflect.get(N.E, "B")).toBe("b");
expect(new Box().value).toEqual([3, 4]);
