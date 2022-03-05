import * as swcHelpers from "@swc/helpers";
// [ts] Initializer provides no value for this binding element and the binding element has no default value.
const { naam , age  } = swcHelpers.objectSpread({}, bob, alice);
