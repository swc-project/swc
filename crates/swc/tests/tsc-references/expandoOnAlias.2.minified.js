//// [expandoOnAlias.ts]
//// [vue.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Vue = function Vue() {
    _class_call_check(this, Vue);
};
export var config = {
    x: 0
};
//// [test.js]
import { Vue, config } from "./vue";
// Expando declarations aren't allowed on aliases.
Vue.config = {}, new Vue(), // This is not an expando declaration; it's just a plain property assignment.
config.x = 1, // This is not an expando declaration; it works because non-strict JS allows
// loosey goosey assignment on objects.
config.y = {}, config.x, config.y;
