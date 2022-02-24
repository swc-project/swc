function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @allowJs: true
// @checkJs: true
// @outDir: ./out
// @lib: es6
// @declaration: true
// @filename: module.js
/**
 * @type {{[P in TaskGroupIds]: {id: P, label: string}}}
 */ /**
 * @typedef TaskGroup
 * @property {TaskGroupIds} id
 * @property {string} label
 * @property {string[]} traceEventNames
 */ /**
 * @type {{[P in TaskGroupIds]: {id: P, label: string}}}
 */ /** @typedef {'parseHTML'|'styleLayout'} TaskGroupIds */ /**
 * @type {{[P in TaskGroupIds]: {id: P, label: string}}}
 */ /**
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
// @filename: index.js
var ref = require('./module.js'), taskGroups = ref.taskGroups, taskNameToGroup = ref.taskNameToGroup;
var MainThreadTasks = function MainThreadTasks(x, y) {
    "use strict";
    _classCallCheck(this, MainThreadTasks);
};
module.exports = MainThreadTasks;
