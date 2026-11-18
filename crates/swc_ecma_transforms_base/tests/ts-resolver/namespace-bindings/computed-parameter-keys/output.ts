namespace Keys__2 {
    export const key__3 = "prop";
}
namespace N__2 {
    export interface key__4 {
        type__0: true;
    }
    export interface Keys__4 {
        type__0: true;
    }
}
namespace N__2 {
    export const key__5 = "prop";
}
namespace N__2 {
    export type Function__6 = ({ [key__5]: value__7 }: Record<string, number>) => typeof value__7;
    export type Nested__6 = ({ outer: { [key__5]: value__8 } }: {
        outer__0: Record<string, number>;
    }) => typeof value__8;
    export type Expression__6 = ({ [key__5 + ""]: value__9 }: Record<string, number>) => typeof value__9;
    export type Annotation__6 = ({ [key__5]: value__10 }: Record<string, number>, original__10: key__4) => typeof value__10;
    export type Member__6 = ({ [Keys__2.key]: value__11 }: Record<string, number>) => typeof value__11;
    export const observed__6 = key__5;
}
