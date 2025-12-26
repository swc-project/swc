//// [errorSuperPropertyAccess.ts]
import "@swc/helpers/_/_assert_this_initialized";
import "@swc/helpers/_/_call_super";
import "@swc/helpers/_/_class_call_check";
import "@swc/helpers/_/_create_class";
import "@swc/helpers/_/_get";
import "@swc/helpers/_/_get_prototype_of";
import "@swc/helpers/_/_inherits";
import "@swc/helpers/_/_set";
new WeakMap(), new WeakMap(), super.wat, super.foo();
