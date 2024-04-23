//// [module.js]
/** @typedef {'parseHTML'|'styleLayout'} TaskGroupIds */ /**
 * @typedef TaskGroup
 * @property {TaskGroupIds} id
 * @property {string} label
 * @property {string[]} traceEventNames
 */ /**
 * @type {{[P in TaskGroupIds]: {id: P, label: string}}}
 */ var taskGroups = {
    parseHTML: {
        id: 'parseHTML',
        label: 'Parse HTML & CSS'
    },
    styleLayout: {
        id: 'styleLayout',
        label: 'Style & Layout'
    }
};
/** @type {Object<string, TaskGroup>} */ var taskNameToGroup = {};
module.exports = {
    taskGroups: taskGroups,
    taskNameToGroup: taskNameToGroup
};
//// [index.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var _require = require('./module.js'), taskGroups = _require.taskGroups, taskNameToGroup = _require.taskNameToGroup;
/** @typedef {import('./module.js').TaskGroup} TaskGroup */ /**
 * @typedef TaskNode
 * @prop {TaskNode[]} children
 * @prop {TaskNode|undefined} parent
 * @prop {TaskGroup} group
 */ /** @typedef {{timers: Map<string, TaskNode>}} PriorTaskData */ var MainThreadTasks = function MainThreadTasks(x, y) {
    "use strict";
    _class_call_check(this, MainThreadTasks);
};
module.exports = MainThreadTasks;
