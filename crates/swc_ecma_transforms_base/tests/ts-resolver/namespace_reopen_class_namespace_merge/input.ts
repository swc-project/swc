namespace N {
    export class C {}
}

namespace N {
    export namespace C {
        export const x = 1;
    }
}

namespace N {
    export const y = new C();
    export let v: C;
}
