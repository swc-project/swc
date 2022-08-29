//// [expandoOnAlias.ts]
//// [vue.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var Vue = function Vue() {
    "use strict";
    _class_call_check(this, Vue);
};
export var config = {
    x: 0
};
//// [test.js]
import { Vue, config } from "./vue";
Vue.config = {}, new Vue(), config.x = 1, config.y = {}, config.x, config.y;
