import { value } from "source";

export function outer(input: number) {
    "use strict";
    const result = input + value;
    {
        let nested = result;
        class Local {
            read() {
                return nested;
            }
        }
        nested = new Local().read();
    }
    return result;
}

export namespace Container {
    import Alias = Container;
    export const item = outer(1);
    export function read() {
        const current = Alias.item;
        return current;
    }
}

const names = { \u0069f: value, \u0061wait: outer };
export { names };
