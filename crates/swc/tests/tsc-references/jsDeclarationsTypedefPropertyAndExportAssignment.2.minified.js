//// [module.js]
module.exports = {
    taskGroups: {
        parseHTML: {
            id: "parseHTML",
            label: "Parse HTML & CSS"
        },
        styleLayout: {
            id: "styleLayout",
            label: "Style & Layout"
        }
    },
    taskNameToGroup: {}
};
//// [index.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var _require = require("./module.js");
_require.taskGroups, _require.taskNameToGroup, module.exports = function MainThreadTasks(x, y) {
    "use strict";
    _class_call_check(this, MainThreadTasks);
};
