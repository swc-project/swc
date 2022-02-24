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
 */ const taskGroups = {
    parseHTML: {
        id: 'parseHTML',
        label: 'Parse HTML & CSS'
    },
    styleLayout: {
        id: 'styleLayout',
        label: 'Style & Layout'
    }
};
/** @type {Object<string, TaskGroup>} */ const taskNameToGroup = {};
module.exports = {
    taskGroups,
    taskNameToGroup
};
// @filename: index.js
const { taskGroups , taskNameToGroup  } = require('./module.js');
/** @typedef {{timers: Map<string, TaskNode>}} PriorTaskData */ /**
 * @typedef TaskNode
 * @prop {TaskNode[]} children
 * @prop {TaskNode|undefined} parent
 * @prop {TaskGroup} group
 */ /** @typedef {{timers: Map<string, TaskNode>}} PriorTaskData */ /** @typedef {import('./module.js').TaskGroup} TaskGroup */ /** @typedef {{timers: Map<string, TaskNode>}} PriorTaskData */ /**
 * @typedef TaskNode
 * @prop {TaskNode[]} children
 * @prop {TaskNode|undefined} parent
 * @prop {TaskGroup} group
 */ /** @typedef {{timers: Map<string, TaskNode>}} PriorTaskData */ class MainThreadTasks {
    /**
     * @param {TaskGroup} x
     * @param {TaskNode} y
     */ constructor(x, y){}
}
module.exports = MainThreadTasks;
