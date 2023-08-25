//// [privateNameComputedPropertyName4.ts]
// https://github.com/microsoft/TypeScript/issues/44113
import { _ as _define_property } from "@swc/helpers/_/_define_property";
_define_property(class {
}, "bar", "test");
