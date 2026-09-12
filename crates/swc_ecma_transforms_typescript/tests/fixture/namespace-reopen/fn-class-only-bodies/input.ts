namespace U {
    export class C {
        w = 3;
    }
}
namespace U {
    export function make() {
        return new C().w;
    }
}
