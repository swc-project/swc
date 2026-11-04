namespace N {
    const enum E { A = 1 }
}
export { N };
namespace Default {
    const enum E { A = 2 }
}
export default Default;
export namespace Public {
    const enum E { A = 3 }
}
namespace Nested.Qualified {
    const enum E { A = 4 }
}
const nested = Nested.Qualified;
namespace Aliased {
    const enum E { A = 5 }
}
import Alias = Aliased;
const alias = Alias;
namespace Unused {
    const enum E { A = 6 }
}
