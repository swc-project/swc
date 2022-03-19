import * as swcHelpers from "@swc/helpers";
var taskGroups = {
    parseHTML: {
        id: 'parseHTML',
        label: 'Parse HTML & CSS'
    },
    styleLayout: {
        id: 'styleLayout',
        label: 'Style & Layout'
    }
}, taskNameToGroup = {};
module.exports = {
    taskGroups: taskGroups,
    taskNameToGroup: taskNameToGroup
};
var ref = require('./module.js'), taskGroups = ref.taskGroups, taskNameToGroup = ref.taskNameToGroup, MainThreadTasks = function(x, y) {
    "use strict";
    swcHelpers.classCallCheck(this, MainThreadTasks);
};
module.exports = MainThreadTasks;
