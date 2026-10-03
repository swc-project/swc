const visits: number[] = [];
enum Outer {
    First = (() => {
        enum Local { Value = 3, Next }
        visits.push(Local.Next);
        return Local.Next;
    })(),
    Second = (() => {
        enum Local { Value = 7 }
        namespace Local { export const extra = 2; }
        visits.push(Local.Value);
        return Local.Value + Local.extra;
    })(),
    After = Second + 1,
}
namespace Container {
    export enum Outer {
        First = (() => {
            enum Inner { Value = 11 }
            visits.push(Inner.Value);
            return Inner.Value;
        })(),
        Second = First + 1,
    }
    export const result = Outer.Second;
}
const result = [
    Outer.First, Outer.Second, Outer.After,
    Container.Outer.First, Container.result, ...visits,
];
