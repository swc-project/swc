//// [importEquals2.ts]
//// [/a.ts]
import "@swc/helpers/_/_class_call_check";
//// [/b.ts]
import './a';
//// [/c.ts]
new a.A();
export { };
