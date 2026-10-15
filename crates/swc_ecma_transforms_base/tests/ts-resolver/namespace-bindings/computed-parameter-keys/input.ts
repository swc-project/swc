namespace Keys { export const key = "prop"; }

namespace N {
    export interface key { type: true; }
    export interface Keys { type: true; }
}
namespace N { export const key = "prop"; }
namespace N {
    export type Function = ({ [key]: value }: Record<string, number>) => typeof value;
    export type Nested = ({ outer: { [key]: value } }: { outer: Record<string, number> }) => typeof value;
    export type Expression = ({ [key + ""]: value }: Record<string, number>) => typeof value;
    export type Annotation = ({ [key]: value }: Record<string, number>, original: key) => typeof value;
    export type Member = ({ [Keys.key]: value }: Record<string, number>) => typeof value;
    export const observed = key;
}
