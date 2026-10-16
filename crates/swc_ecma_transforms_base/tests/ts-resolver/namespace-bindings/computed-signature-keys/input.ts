const key = 2;
namespace N { export const key = 1; }
namespace N {
    export type Property = { [key]: typeof key };
    export type Accessors = {
        get [key](): typeof key;
        set [key](value: 1);
    };
    export const y = key;
}
