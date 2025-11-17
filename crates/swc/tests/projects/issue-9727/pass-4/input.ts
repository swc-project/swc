import { IS_DEV_MODE } from "debug";

function ifDev(callback: () => void) {
    if (IS_DEV_MODE) {
        callback();
    }
}

export class Foo {
    constructor() {
        ifDev(() => {
            Object.defineProperties({
                hello: {
                    enumerable: true,
                    get x() { return 1; }
                }
            })
        })
    }
}
