//// [module.js]
/** @typedef {'parseHTML'|'styleLayout'} TaskGroupIds */ /**
 * @typedef TaskGroup
 * @property {TaskGroupIds} id
 * @property {string} label
 * @property {string[]} traceEventNames
 */ /**
 * @type {{[P in TaskGroupIds]: {id: P, label: string}}}
 */ module.exports = {
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var _require = require("./module.js");
_require.taskGroups, _require.taskNameToGroup, module.exports = /** @typedef {import('./module.js').TaskGroup} TaskGroup */ /**
 * @typedef TaskNode
 * @prop {TaskNode[]} children
 * @prop {TaskNode|undefined} parent
 * @prop {TaskGroup} group
 */ /** @typedef {{timers: Map<string, TaskNode>}} PriorTaskData */ function MainThreadTasks(x, y) {
    _class_call_check(this, MainThreadTasks);
};
