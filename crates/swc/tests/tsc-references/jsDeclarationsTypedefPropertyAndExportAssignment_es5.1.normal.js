import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @allowJs: true
// @checkJs: true
// @outDir: ./out
// @lib: es6
// @declaration: true
// @filename: module.js
/** @typedef {'parseHTML'|'styleLayout'} TaskGroupIds */ /**
 * @typedef TaskGroup
 * @property {TaskGroupIds} id
 * @property {string} label
 * @property {string[]} traceEventNames
 */ /**
 * @type {{[P in TaskGroupIds]: {id: P, label: string}}}
 */ var taskGroups = {
    parseHTML: {
        id: "parseHTML",
        label: "Parse HTML & CSS"
    },
    styleLayout: {
        id: "styleLayout",
        label: "Style & Layout"
    }
};
/** @type {Object<string, TaskGroup>} */ var taskNameToGroup = {};
module.exports = {
    taskGroups: taskGroups,
    taskNameToGroup: taskNameToGroup
};
// @filename: index.js
var ref = require("./module.js"), taskGroups = ref.taskGroups, taskNameToGroup = ref.taskNameToGroup;
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
