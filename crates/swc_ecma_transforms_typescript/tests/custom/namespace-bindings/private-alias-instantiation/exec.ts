namespace Types { export interface T {} }
namespace Values { export const value = 1; }

namespace PrivateType { import A = Types; }
namespace TypeAliases { export import Q = PrivateType; }
namespace PrivateValue { import A = Values; }
namespace ValueAliases { export import Q = PrivateValue; }

namespace Exported { export import A = Types; }
namespace ExportedAliases { export import Q = Exported; }

namespace Nested.Inner { import A = Types; }
namespace NestedAliases { export import Q = Nested.Inner; }
namespace NestedExported.Inner { export import A = Types; }
namespace NestedExportedAliases { export import Q = NestedExported.Inner; }

namespace Merged { import A = Types; }
namespace Merged { export const value = 2; }
namespace MergedAliases { export import Q = Merged; }

namespace Used {
    import A = Values;
    export const value = A.value;
}
namespace ForwardPrivate { import A = Later; }
namespace ForwardAliases { export import Q = ForwardPrivate; }
namespace Later { export const value = 3; }

expect([
    TypeAliases,
    ValueAliases,
    ExportedAliases,
    NestedAliases,
    NestedExportedAliases,
    MergedAliases,
    Used.value,
    ForwardAliases,
]).toEqual([{}, {}, { Q: {} }, {}, { Q: {} }, { Q: { value: 2 } }, 1, {}]);
expect(eval("typeof Types")).toBe("undefined");
expect(eval("typeof PrivateType")).toBe("undefined");
expect(eval("typeof PrivateValue")).toBe("undefined");
expect(eval("typeof Nested")).toBe("undefined");
expect(eval("typeof ForwardPrivate")).toBe("undefined");
