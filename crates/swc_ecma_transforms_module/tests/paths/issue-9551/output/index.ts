// Hidden directory imports should preserve ./ prefix
export { dotFoo } from "./.foo/index.js";
export { dotFoo as dotFooReExport } from "./.foo/index.js";
// Regular directory imports
export { foo } from "./foo/index.js";
export { foo as fooReExport } from "./foo/index.js";
