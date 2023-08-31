//// [privateNameStaticEmitHelpers.ts]
//// [main.ts]
import "@swc/helpers/_/_class_static_private_field_spec_set";
import "@swc/helpers/_/_class_static_private_method_get";
export class S {
}
//// [tslib.d.ts]
// these are pre-TS4.3 versions of emit helpers, which only supported private instance fields
export { };
