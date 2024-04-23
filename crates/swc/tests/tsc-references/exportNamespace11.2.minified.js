//// [main.ts]
import * as intermediate from './intermediate';
new intermediate.Ghost();
//// [intermediate.ts]
export { };
//// [ghost.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Ghost = function Ghost() {
    _class_call_check(this, Ghost);
};
