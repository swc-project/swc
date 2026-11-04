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
console.log(Reflect.get(E, "A"), Reflect.get(E, "B"));
console.log(Reflect.get(N.E, "A"), Reflect.get(N.E, "B"));
console.log(new Box().value);
