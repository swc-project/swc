import { typeOnly, value, ambient, aliasTarget } from "dependency";

namespace Merged {
    export namespace Nested {
        export interface Shape { value: typeof typeOnly }
    }
}
namespace Merged {
    export namespace Nested {
        export const result = value;
    }
}
namespace Signatures {
    export namespace Nested {
        export declare function call(): typeof ambient;
    }
}
namespace Aliases {
    namespace Nested {
        import Local = aliasTarget;
    }
}
namespace Dotted.Inner.Deep {
    export const result = value;
}
namespace Types.Inner.Deep {
    export type Shape = typeof typeOnly;
}
declare namespace Ambient {
    export const result: typeof ambient;
}
const enum Flag { Value = 1 }
export const result = [Merged.Nested.result, Dotted.Inner.Deep.result, Flag.Value];
