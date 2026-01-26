// Hidden directory imports should preserve ./ prefix
export { dotFoo } from "./.foo";
export { dotFoo as dotFooReExport } from ".foo";

// Regular directory imports
export { foo } from "./foo";
export { foo as fooReExport } from "foo";
