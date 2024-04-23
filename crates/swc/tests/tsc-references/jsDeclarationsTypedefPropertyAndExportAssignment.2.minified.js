//// [module.js]
module.exports = {
    taskGroups: {
        parseHTML: {
            id: 'parseHTML',
            label: 'Parse HTML & CSS'
        },
        styleLayout: {
            id: 'styleLayout',
            label: 'Style & Layout'
        }
    },
    taskNameToGroup: {}
};
//// [index.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var _require = require('./module.js');
_require.taskGroups, _require.taskNameToGroup, module.exports = function MainThreadTasks(x, y) {
    _class_call_check(this, MainThreadTasks);
};
