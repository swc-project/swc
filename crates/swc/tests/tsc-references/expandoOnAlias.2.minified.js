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
Vue.config = {}, new Vue(), config.x = 1, config.y = {}, config.x, config.y;
